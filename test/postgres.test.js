'use strict'

var should = require('should')
var postgresModule = require('../postgres.js')

describe('trombone', function() {
/*

			getScumFilter: function (callback) {
				callback(null, [])
			},
			getPreviousError: function (callback) {
				callback(null, [])
			},
			addScumFilterEntry: function(entry, callback) {
				callback()
			},
			removeScumFilterEntry: function(entry, callback) {
				callback()
			},
			storeError: function(error, callback) {
				callback()
			},
			removeError: function(callback) {
				callback()
			}
*/
	describe('postgres', function() {

		var mockClient

		beforeEach(function (done) {
			mockClient = {
				connect: function(callback) {
					callback()
				},
				query: function(sql, callback) {
					callback(null, {rows: []})
				}
			}
			done()
		})

		// Given no client connection exists
		// When the scum filter is requested
		// Then a pg client connection is made
		it ('Given no client connection exists ' +
			'When the scum filter is requested ' +
			'Then a pg client connection is made', function(done){
			var connectionMade = false
			process.env.WROTH_TROMBONE_DATABASE_URL = 'POSTGRES_URL'
			var mockPg = {
				Client: function(connectionString) {
					connectionString.should.equal('POSTGRES_URL')
					mockClient.connect = function(callback) {
						connectionMade = true
						callback()
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getScumFilter(function(){
				connectionMade.should.be.true
				done()
			})
		})

		// When the scum filter is requested
		// Then correct sql is issued to the db connection
		it ('When the scum filter is requested ' +
			'Then correct sql is issued to the db connection', function(done){
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						sqlIssuedToDbConnection = true
						sql.should.equal('SELECT username FROM scumfilter')
						callback(null, {rows: []})
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getScumFilter(function(){
				sqlIssuedToDbConnection.should.be.true
				done()
			})
		})

		// Given no entries exist in the Scum Filter
		// When the scum filter is requested
		// Then an empty array is passed to the callback
		it ('Given no entries exist in the Scum Filter ' +
			'When the scum filter is requested ' +
			'Then an empty array is passed to the callback', function(done){
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(null, {
							rows: []
						})
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getScumFilter(function(e, results){
				results.length.should.equal(0)
				done()
			})
		})

		// Given one entry exists in the Scum Filter
		// When the scum filter is requested
		// Then an array containing one item is passed to the callback
		it ('Given one entry exists in the Scum Filter ' +
			'When the scum filter is requested ' +
			'Then an array containing one item is passed to the callback', function(done){
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(null, {
							rows: [{username: 'USERNAME1'}]
						})
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getScumFilter(function(e, results){
				results.length.should.equal(1)
				results[0].should.equal('USERNAME1')
				done()
			})
		})


		// Given > one entry exists in the Scum Filter
		// When the scum filter is requested
		// Then an array containing all the items is passed to the callback
		it ('Given > one entry exists in the Scum Filter ' +
			'When the scum filter is requested ' +
			'Then an array containing all the items is passed to the callback', function(done){
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(null, {
							rows: [
								{username: 'USERNAME1'},
								{username: 'USERNAME2'},
								{username: 'USERNAME3'}
							]
						})
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getScumFilter(function(e, results){
				results.length.should.equal(3)
				results[0].should.equal('USERNAME1')
				results[1].should.equal('USERNAME2')
				results[2].should.equal('USERNAME3')
				done()
			})
		})


		// Given an error occurs
		// When the scum filter is requested
		// Then the error is passed to the callback
		it ('Given an error occurs ' +
			'When the scum filter is requested ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error('an error')
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(error)
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getScumFilter(function(e){
				e.should.equal(error)
				done()
			})
		})

		// Given no client connection exists
		// When the scum filter is requested
		// Then a pg client connection is made
		it ('Given no client connection exists ' +
			'When the scum filter is requested ' +
			'Then a pg client connection is made', function(done){
			var connectionMade = false
			process.env.WROTH_TROMBONE_DATABASE_URL = 'POSTGRES_URL'
			var mockPg = {
				Client: function(connectionString) {
					connectionString.should.equal('POSTGRES_URL')
					mockClient.connect = function(callback) {
						connectionMade = true
						callback()
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getPreviousError(function(){
				connectionMade.should.be.true
				done()
			})
		})

		// When the previous error is requested
		// Then correct sql is issued to the db connection
		it ('When the previous error is requested ' +
			'Then correct sql is issued to the db connection', function(done){
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						sqlIssuedToDbConnection = true
						sql.should.equal('SELECT error FROM error')
						callback(null, {rows: []})
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getPreviousError(function(){
				sqlIssuedToDbConnection.should.be.true
				done()
			})
		})

		// Given no previous error exists
		// When the previous error is requested
		// Then an empty array is passed to the callback

		// Given a previous error exists
		// When the previous error is requested
		// Then the error is passed to the callback 

		// Given an error occurs
		// When the previous error is requested
		// Then the error is passed to the callback

		// Given an error occurs
		// When adding an entry to the scum filter
		// Then the error is passed to the callback

		// Given no error occurs
		// When adding an entry to the scum filter
		// Then the entry is added to the scum filter

		// Given an error occurs
		// When removing an entry from the scum filter
		// Then the error is passed to the callback

		// Given no error occurs
		// When removing an entry from the scum filter
		// Then the entry is removed from the scum filter

		// Given an error occurs
		// When an error is being stored
		// Then the error is passed to the callback

		// Given no error occurs
		// When an error is being stored
		// Then the error is stored in JSON format

		// Given an error occurs
		// When an error is being removed
		// Then the error is passed to the callback

		// Given no error occurs
		// When an error is being removed
		// Then the error is removed

	})
})