"use strict"

var waterfall = require('async-waterfall')

module.exports = function(db, rq, parp, email) {

	// PUBLIC METHODS
	function observe(callback) {

		waterfall([

			function(next) {
				db.getScumFilter(function(e, data) {
					if (e) if (typeof callback == 'function') return callback(e)
					next(null, data)
				})
			},

			function(dbScumFilter, next) {
				rq(process.env.WROTH_TROMBONE_WROTH_URL, function(e, html) {
					if (e) return webError(e, callback)
					db.getPreviousError(function(e, data) {
						if (e) return callback(e)
						if (data.length > 0) {
							email.resumption(function() {
								db.removeError(function(e){
									if (e) return callback(e)
								})
							})
						}
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

					next(null, dbScumFilter, scum)
				})
			},

			function(dbScumFilter, webScumFilter, next) {

				var newEntries = []
				var removedEntries = []
				for (var x=0; x<webScumFilter.length; x++) {
					var webEntry = webScumFilter[x]
					var found = false
					for (var y=0; y<dbScumFilter.length; y++) {
						if (dbScumFilter[y] == webEntry) found = true
					}
					if (!found) newEntries.push(webEntry)
				}

				for (var x=0; x<dbScumFilter.length; x++) {
					var dbEntry = dbScumFilter[x]
					var found = false
					for (var y=0; y<webScumFilter.length; y++) {
						if (webScumFilter[y] == dbEntry) found = true
					}
					if (!found) removedEntries.push(dbEntry)
				}
				next(null, newEntries, removedEntries, webScumFilter)
			},

			function(newScumFilterEntries, removedScumFilterEntries, allScumFilterEntries, next) {
				waterfall(newScumFilterEntries.map(
					function(entry) {
						console.log(entry)
						return function(last, nextCallback) {
							if (typeof last == 'function') nextCallback = last
							parp('\'' + entry + '\' added to Scum Filter.')
							nextCallback()
						}
					}					
				),
				function (e) {
					next(null, newScumFilterEntries, removedScumFilterEntries, allScumFilterEntries)
				})
			},

			function(newScumFilterEntries, removedScumFilterEntries, allScumFilterEntries, next) {
				waterfall(newScumFilterEntries.map(
					function(entry) {
						return function(last, nextCallback) {
							if (typeof last == 'function') nextCallback = last
							db.addScumFilterEntry(entry, function(){
								nextCallback()
							})
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
							parp('\'' + entry + '\' removed from Scum Filter.')
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
							db.removeScumFilterEntry(entry, function() {
								nextCallback()
							})
						}
					}
				),
				function (e) {
					next()
				})
			},

		], function(e) {
			if (e) if (typeof callback == 'function') return callback(e)
			if (typeof callback == 'function') callback(null)
		})

	}

	// PRIVATE METHODS
	function webError(e, callback) {
		db.getPreviousError(function(dbError, data) {
			if (dbError) if (typeof callback == 'function') return callback(dbError)
			if (data.length == 0) {
				db.storeError(e, function() {
					email.error(function() {
						if (typeof callback == 'function') return callback(e)
					})
				})
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
