"use strict"

var waterfall = require('async-waterfall')

module.exports = function(fs, rq) {

	function observe(callback) {

		waterfall([

			function(next) {
				fs.readFile('scumfilter.js', 'utf8', function(e) {
					if (e) {
						if (e.code == 'ENOENT') {

						}
						else {
							if (typeof callback == 'function') return callback(e)
						}
					}
					next()
				})
			},

			function(next) {
				rq('http://www.wrathofthebarclay.co.uk/interactive/board/board.php', function() {
					next()
				})
			}
		], function() {
			if (typeof callback == 'function') callback(null)
		})

	}

	function parp() {}

	return {
		observe: observe,
		parp: parp
	}
}