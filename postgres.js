'use strict'

module.exports = function(pg) {

	var client
	var connected = false

	function connect (callback) {
		client = new pg.Client(process.env.WROTH_TROMBONE_DATABASE_URL)
		client.connect(function () {
			connected = true
			callback()
		})
	}

	function query(method) {
		if (connected) {
			method()
		}
		else {
			connect (method)
		}
	}

	return {
		getScumFilter: function (callback) {
			query(function () {
				client.query('SELECT username FROM scumfilter', function (e, results) {
					if (e) if (typeof callback == 'function') return callback(e)
					var usernames = []
					for (var x=0; x<results.rows.length; x++) {
						usernames.push(results.rows[x].username)
					}
					if (typeof callback == 'function') callback(null, usernames)
				})
			})
		},

		getPreviousError: function(callback) {
			query(function () {
				client.query('SELECT error FROM error', function (e, results) {
					callback()
				})
			})
		}
	}
}