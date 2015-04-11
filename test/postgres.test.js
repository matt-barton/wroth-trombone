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
				},
				end: function() {}
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
		// Then null results are passed to the callback
		it ('Given no previous error exists ' +
			'When the previous error is requested ' +
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
			pg.getPreviousError(function(e, result){
				(result == null).should.be.true
				done()
			})
		})

		// Given a previous error exists
		// When the previous error is requested
		// Then the error is passed to the callback 
		it ('Given a previous error exists ' +
			'When the previous error is requested ' +
			'Then the error is passed to the callback', function(done){
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(null, {
							rows: [{ error: 'THE ERROR'}]
						})
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getPreviousError(function(e, result){
				result.should.equal('THE ERROR')
				done()
			})
		})

		// Given an error occurs
		// When the previous error is requested
		// Then the error is passed to the callback
		it ('Given an error occurs ' +
			'When the previous error is requested ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error('the error')
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(error)
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.getPreviousError(function(e, result){
				e.should.equal(error)
				done()
			})
		})

		// Given no client connection exists
		// When adding an entry to the scum filter
		// Then a pg client connection is made
		it ('Given no client connection exists ' +
			'When adding an entry to the scum filter ' +
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
			pg.addScumFilterEntry(null, function(){
				connectionMade.should.be.true
				done()
			})
		})

		// Given no error occurs
		// When adding an entry to the scum filter
		// Then the entry is added to the scum filter
		it ('Given no error occurs ' +
			'When adding an entry to the scum filter ' +
			'Then the entry is added to the scum filter', function(done){
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						sqlIssuedToDbConnection = true
						sql.should.equal('INSERT INTO scumfilter (username) VALUES (\'USERNAME\')')
						callback(null, {rows: []})
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.addScumFilterEntry('USERNAME', function(){
				sqlIssuedToDbConnection.should.be.true
				done()
			})
		})

		// Given an error occurs
		// When adding an entry to the scum filter
		// Then the error is passed to the callback
		it ('Given an error occurs ' +
			'When adding an entry to the scum filter ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error ('the error')
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(error)
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.addScumFilterEntry('USERNAME', function(e){
				e.should.equal(error)
				done()
			})
		})

		// Given no client connection exists
		// When removing an entry from the scum filter
		// Then a pg client connection is made
		it ('Given no client connection exists ' +
			'When removing an entry from the scum filter ' +
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
			pg.removeScumFilterEntry (null, function(){
				connectionMade.should.be.true
				done()
			})
		})

		// Given no error occurs
		// When removing an entry from the scum filter
		// Then the entry is removed from the scum filter
		it ('Given no error occurs ' +
			'When removing an entry from the scum filter ' +
			'Then the entry is removed from the scum filter', function(done){
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						sqlIssuedToDbConnection = true
						sql.should.equal('DELETE FROM scumfilter WHERE username = \'USERNAME\'')
						callback()
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.removeScumFilterEntry('USERNAME', function(){
				sqlIssuedToDbConnection.should.be.true
				done()
			})
		})

		// Given an error occurs
		// When removing an entry from the scum filter
		// Then the error is passed to the callback
		it ('Given an error occurs ' +
			'When removing an entry from the scum filter ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error ('an error')
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(error)
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.removeScumFilterEntry('USERNAME', function(e){
				e.should.equal(error)
				done()
			})
		})

		// Given no client connection exists
		// When an error is being stored
		// Then a pg client connection is made
		it ('Given no client connection exists ' +
			'When an error is being stored ' +
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
			pg.storeError (null, function(){
				connectionMade.should.be.true
				done()
			})
		})

		// Given no error occurs
		// When an error is being stored
		// Then the error is stored in JSON format
		it ('Given no error occurs ' +
			'When an error is being stored ' +
			'Then the error is stored in JSON format', function(done){
			var errorToStore = new Error('this is the error to store')
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						sqlIssuedToDbConnection = true
						sql.should.equal('INSERT INTO error (error) VALUES (\'' + JSON.stringify(errorToStore) + '\')')
						callback()
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.storeError(errorToStore, function(){
				sqlIssuedToDbConnection.should.be.true
				done()
			})
		})

		// Given an error occurs
		// When an error is being stored
		// Then the error is passed to the callback
		it ('Given an error occurs ' +
			'When an error is being stored ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error('this is the error')
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(error)
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.storeError(new Error, function(e){
				e.should.equal(error)
				done()
			})
		})

		// Given no client connection exists
		// When an error is being removed
		// Then a pg client connection is made
		it ('Given no client connection exists ' +
			'When an error is being removed ' +
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
			pg.removeError (function(){
				connectionMade.should.be.true
				done()
			})
		})

		// Given no error occurs
		// When an error is being removed
		// Then the error is removed
		it ('Given no error occurs ' +
			'When an error is being removed ' +
			'Then the error is removed', function(done){
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						sqlIssuedToDbConnection = true
						sql.should.equal('DELETE FROM error')
						callback()
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.removeError(function(){
				sqlIssuedToDbConnection.should.be.true
				done()
			})
		})

		// Given an error occurs
		// When an error is being removed
		// Then the error is passed to the callback
		it ('Given an error occurs ' +
			'When an error is being removed ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error ('this is the error')
			var sqlIssuedToDbConnection = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.query = function(sql, callback) {
						callback(error)
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.removeError(function(e){
				e.should.equal(error)
				done()
			})
		})

		// Given a client connection exists
		// When the connection is closed
		// Then the client connection is closed
		it('Given a client connection exists ' +
			'When the connection is closed ' +
			'Then the client connection is closed', function (done) {
			var connectionClosed = false
			var mockPg = {
				Client: function(connectionString) {
					mockClient.end = function() {
						connectionClosed = true
					}
					return mockClient
				}
			}
			var pg = require('../postgres')(mockPg)
			pg.removeError(function () {
				pg.close(function(){
					connectionClosed.should.be.true
					done()
				})
			})
		})
	})
})