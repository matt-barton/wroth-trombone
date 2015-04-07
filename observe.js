"use strict"

var waterfall = require('async-waterfall')

module.exports = function(fs, rq, parp, email) {

	// PUBLIC METHODS
	function observe(callback) {

		waterfall([

			function(next) {
				fs.readFile('scumfilter.js', 'utf8', function(e, data) {
					if (e) {
						if (e.code == 'ENOENT') {
							var file = JSON.stringify([])
							return fs.writeFile('scumfilter.js', file, function(e) {
								if (e) if (typeof callback == 'function') return callback(e)
								return next(null, JSON.parse(file))
							})
						}
						else {
							if (typeof callback == 'function') return callback(e)
						}
					}
					next(null, JSON.parse(data))
				})
			},

			function(fsScumFilter, next) {
				rq('http://www.wrathofthebarclay.co.uk/interactive/board/board.php', function(e, html) {
					if (e) return webError(e, callback)
					previousErrorLogged(function(e, data) {
						if (!e) email.resumption()	
					})
					function fail() {
						callback(new Error('No scum filter entries could be found.'))
					}
					var regex = /.*var scum = '(\[[^\]]+\]).*/
					var scum = []
					try {
						var matches = regex.exec(html.body)
						if (matches == null) return fail()
						scum = JSON.parse(matches[1])
						if (scum.length == 0) {
							if (typeof callback == 'function') fail()
							return
						}
					}
					catch (e) {
						if (typeof callback == 'function') return fail()
					}

					next(null, fsScumFilter, scum)
				})
			},

			function(fsScumFilter, webScumFilter, next) {

				var newEntries = []
				var removedEntries = []
				for (var x=0; x<webScumFilter.length; x++) {
					var webEntry = webScumFilter[x]
					var found = false
					for (var y=0; y<fsScumFilter.length; y++) {
						if (fsScumFilter[y] == webEntry) found = true
					}
					if (!found) newEntries.push(webEntry)
				}

				for (var x=0; x<fsScumFilter.length; x++) {
					var fsEntry = fsScumFilter[x]
					var found = false
					for (var y=0; y<webScumFilter.length; y++) {
						if (webScumFilter[y] == fsEntry) found = true
					}
					if (!found) removedEntries.push(fsEntry)
				}
				next(null, newEntries, removedEntries, webScumFilter)
			},

			function(newScumFilterEntries, removedScumFilterEntries, allScumFilterEntries, next) {
				waterfall(newScumFilterEntries.map(
					function(entry) {
						return function(last, nextCallback) {
							if (typeof last == 'function') nextCallback = last
							parp(entry + ' added to Scum Filter.')
							nextCallback()
						}
					}					
				),
				function (e) {
					next(null, newScumFilterEntries, removedScumFilterEntries, allScumFilterEntries)
				})
			},

			function(newScumFilterEntries, removedScumFilterEntries, allScumFilterEntries, next) {
				waterfall(removedScumFilterEntries.map(
					function(entry) {
						return function(last, nextCallback) {
							if (typeof last == 'function') nextCallback = last
							parp(entry + ' removed from Scum Filter.')
							nextCallback()
						}
					}
				),
				function (e) {
					var writeScumFilter = newScumFilterEntries.length > 0 || removedScumFilterEntries.length > 0
					next(null, writeScumFilter ? allScumFilterEntries : false)
				})
			},

			function(allScumFilterEntries, next) {
				if (allScumFilterEntries !== false) {
					fs.writeFile('scumfilter.js', JSON.stringify(allScumFilterEntries), function() {
						next()
					})
				}
				else {
					next()
				}
			}

		], function(e) {
			if (e) if (typeof callback == 'function') return callback(e)
			if (typeof callback == 'function') callback(null)
		})

	}

	// PRIVATE METHODS
	function previousErrorLogged(callback) {
		fs.readFile('error.js', 'utf8', callback)
	} 

	function webError(e, callback) {
		previousErrorLogged(function(fsError, data) {
			if (fsError) {
				if (fsError.code == 'ENOENT') {
					fs.writeFile('error.js', JSON.stringify(e), function() {
						email.error(function() {
							if (typeof callback == 'function') return callback(e)
						})
					})
				}
				else {

				}
			}
			else {
				if (typeof callback == 'function') return callback(e)
			}
		})
	}

	// RETURN INTERFACE
	return  {
		go: observe
	}
}
