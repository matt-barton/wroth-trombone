"use strict"

var waterfall = require('async-waterfall')

module.exports = function(fs, rq) {

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
					if (e) if (typeof callback == 'function') return callback(e)
					function fail() {
						callback(new Error('No scum filter entries could be found.'))
					}
					var regex = /^.*var scum = '(\[.+\])'\.evalJSON.*$/
					var scum = []
					try {
						var matches = regex.exec(html);
						if (matches == null) return fail()
						scum = JSON.parse(matches[1]);
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
				waterfall(webScumFilter.map(
					function(webFilterEntry){ 
						return function (lastResult, webCallback) {
							if (typeof lastResult == 'function') webCallback = lastResult
							if (typeof lastResult != 'array') lastResult = []
							waterfall(fsScumFilter.map(
								function(fsFilterEntry) {
									return function (last, fsCallback) {
										if (typeof last == 'function') fsCallback = last
										if (last === true) return fsCallback(null, true)
										if (webFilterEntry == fsFilterEntry) return fsCallback(null, true)
										fsCallback(null, false);
									}
								}),
								function(e, found) {
									if (!found) {
										lastResult.push(webFilterEntry);
									}
									webCallback(null, lastResult)
								} 
							)
						}
					}),
					function(e, newEntries) {
						next(null, newEntries)
					}
				)
			},

			function(newScumFilterEntries, next) {
				waterfall(newScumFilterEntries.map(
					function(entry) {
						return function(last, nextCallback) {
							if (typeof last == 'function') nextCallback = last;
							nextCallback()
						}
					}
					
				),
				function (e) {
					next(null)
				})
			}

		], function(e) {
			if (e) if (typeof callback == 'function') return callback(e)
			if (typeof callback == 'function') callback(null)
		})

	}

	function parp() {}

	return {
		observe: observe,
		parp: parp
	}
}