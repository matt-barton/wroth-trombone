'use strict'

module.exports = function(pg) {

	var client
	var connected = false

	function connect (callback) {
		client = new pg.Client(process.env.WROTH_TROMBONE_DATABASE_URL)
		client.connect(function (e) {
			if (e) return callback(e)
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
			query(function (e) {
				if (e) if (typeof callback == 'function') return callback(e)
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
					if (e) if (typeof callback == 'function') return callback(e)
					if (results.rows.length > 0) return callback (null, results.rows[0].error)
					callback(null, null)
				})
			})
		},

		addScumFilterEntry: function(username, callback) {
			query(function() {
				client.query('INSERT INTO scumfilter (username) VALUES (\'' + username + '\')', function(e) {
					if (e) if (typeof callback == 'function') return callback(e)
					callback()
				})
			})
		},

		removeScumFilterEntry: function(username, callback) {
			query(function () {
				client.query('DELETE FROM scumfilter WHERE username = \'' + username + '\'', function(e) {
					if (e) if (typeof callback == 'function') return callback(e)
					callback()
				})
			})
		},

		storeError: function(error, callback) {
			query(function () {
				client.query('INSERT INTO error (error) VALUES (\'' + JSON.stringify(error) + '\')', function (e) {
					if (e) if (typeof callback == 'function') return callback(e)
					callback()
				})
			})
		},

		removeError: function(callback) {
			query(function () {
				client.query('DELETE FROM error', function (e) {
					if (e) if (typeof callback == 'function') return callback(e)
					callback()
				})
			})
		},

		close: function (callback) {
			if (connected) {
				client.end()
				connected = false
			}
			if (typeof callback == 'function') callback()
		}
	}
}