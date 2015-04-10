"use strict"

var should = require('should')
var observeModule = require('../observe.js')

describe('trombone', function() {

	var mockDb,
		mockRequest,
		mockParp,
		mockEmail

	beforeEach(function(done) {
		mockDb = {
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
		}

		mockRequest = function(url, callback) {
			callback(null, {body: ''})
		}

		mockParp = function(message, callback) {
			if (typeof callback == 'function') callback(null)
		}

		mockEmail = {
			error: function (callback) {
				if (typeof callback == 'function') callback(null)
			},
			resumption: function (callback) {
				if (typeof callback == 'function') callback(null)
			}
		}

		process.env.WROTH_TROMBONE_WROTH_URL = 'WROTH_URL'
		
		done()
	})

	describe('observe', function() {

		// When trombone is observing
		// Then trombone is asked to observe.
		it ('When trombone is observing ' + 
			'Then trombone is asked to observe.', function(done){
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go()
			done()
		})

		// Given observing is complete 
		// When trombone is observing 
		// Then the provided callback is called.
		it ('Given observing is complete ' + 
			'When trombone is observing ' + 
			'Then the provided callback is called.', function(done){
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				done()
			})
		})

		// When trombone is observing
		// Then the current scum filter list is requested from the database
		it ('When trombone is observing ' + 
			'Then the current scum filter list is read from the file system', function(done) {
			var dbScumFilterRequested = false
			mockDb.getScumFilter = function(callback) {
				dbScumFilterRequested = true
				callback(null, [])
			}
			
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				dbScumFilterRequested.should.be.true
				done()
			})
		})

		// Given an error occurs
		// When the current scum filter is read
		// Then the error is passed to the callback
		it ('Given an error occurs ' + 
			'When the current scum filter is read ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error()
			mockDb.getScumFilter = function(callback) {
				callback(error)
			}
		
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				e.should.equal(error)
				done()
			})
		})

		// Given an error occurs
		// When the current scum filter is read
		// Then the wroth index page is not requested from the web
		it ('Given an error occurs ' + 
			'When the current scum filter is read ' +
			'Then the wroth index page is not requested from the web', function(done){
			var wrothRequested = false
			var error = new Error()
			mockDb.getScumFilter = function(callback) {
				callback(error)
			}
			var mockRequest = function(url, callback) {
				wrothRequested = true
				callback(null, {body: ''})
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				wrothRequested.should.be.false
				done()
			})
		})
		
		// When trombone is observing
		// Then the wroth index page is requested from the web
		it ('When trombone is observing ' + 
			'Then the wroth index page is requested from the web', function(done) {
			var mockRequest = function(url, callback) {
				url.should.equal('WROTH_URL')
				callback(null, {body: ''})
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				done()
			})
		})		

		// Given an error occurs
		// When the wroth index page is requested from the web
		// Then the error is passed back to the caller
		it ('Given an error occurs ' + 
			'When the wroth index page is requested from the web ' + 
			'Then the error is passed back to the caller', function(done) {
			var error = new Error('the error')
			var mockRequest = function(url, callback) {
				callback(error)
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				e.should.equal(error)
				done()
			})
		})

		// Given an error occurs
		// When the wroth index page is requested from the web
		// Then the presence of a previous error is checked
		it ('Given an error occurs ' + 
			'When the wroth index page is requested from the web ' + 
			'Then the presence of a previous error is checked', function(done) {
			var error = new Error
			var errorChecked = false
			var mockRequest = function(url, callback) {
				callback(error)
			}
			mockDb.getPreviousError = function(callback) {
				errorChecked = true
				callback(null, [])
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				errorChecked.should.be.true
				done()
			})
		})

		// Given an error occurs
		// And no error has previously been recorded
		// When the wroth index page is requested from the web
		// Then an error is recorded
		it ('Given an error occurs ' +
			'And no error has previously been recorded ' +
			'When the wroth index page is requested from the web ' + 
			'Then an error is recorded', function(done) {
			var error = new Error('test error message')
			var errorRecorded = false
			var mockRequest = function(url, callback) {
				callback(error)
			}
			mockDb.getPreviousError = function(callback) {
				callback(null, [])
			}
			mockDb.storeError = function(errorToStore, callback) {
				errorRecorded = true
				errorToStore.should.equal(error)
				callback()
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				errorRecorded.should.be.true
				done()
			})
		})

		// Given an error occurs
		// And no error has previously been recorded
		// When the wroth index page is requested from the web
		// Then an error email is requested
		it ('Given an error occurs ' +
			'And no error has previously been recorded ' +
			'When the wroth index page is requested from the web ' + 
			'Then an error email is requested', function(done) {
			var error = new Error('test error message')
			var emailRequested = false
			var mockRequest = function(url, callback) {
				callback(error)
			}
			mockDb.getPreviousError = function(callback) {
				callback(null, [])
			}
			mockEmail.error = function (callback) {
				emailRequested = true
				callback()
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				emailRequested.should.be.true
				done()
			})
		})

		// Given no error occurs
		// And an error has previously been recorded
		// When the wroth index page is requested from the web
		// Then a resumption of service email is requested
		it ('Given no error occurs ' +
			'And an error has previously been recorded ' +
			'When the wroth index page is requested from the web ' + 
			'Then a resumption of service email is requested', function(done) {
			var error = new Error('previous error')
			var emailRequested = false
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE"]\'.evalJSON'
				})
			}
			mockDb.getPreviousError = function(callback) {
				callback(null, JSON.stringify(error))
			}
			mockEmail.resumption = function() {
				emailRequested = true
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				emailRequested.should.be.true
				done()
			})
		})

		// Given no error occurs
		// And an error has previously been recorded
		// When the wroth index page is requested from the web
		// Then the previous error is deleted from the file system
		it ('Given no error occurs ' +
			'And an error has previously been recorded ' +
			'When the wroth index page is requested from the web ' + 
			'Then the previous error is deleted from the file system', function(done) {
			var error = new Error('previous error')
			var errorDeleted = false
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE"]\'.evalJSON'
				})
			}
			mockDb.getPreviousError = function(callback) {
				callback(null, JSON.stringify(error))
			}
			mockDb.removeError = function(callback) {
				errorDeleted = true
				callback()
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				errorDeleted.should.be.true
				done()
			})
		})

		// Given an error occurs
		// And an error has previously been recorded
		// When the wroth index page is requested from the web
		// Then no error is recorded
		it ('Given an error occurs ' +
			'And an error has previously been recorded ' +
			'When the wroth index page is requested from the web ' + 
			'Then no error is recorded', function(done) {
			var error = new Error('test error message')
			var previousError = new Error('previous error')
			var errorRecorded = false
			var mockRequest = function(url, callback) {
				callback(error)
			}
			mockDb.getPreviousError = function(callback) {
				callback(null, JSON.stringify(previousError))
			}
			mockDb.storeError = function(errorToStore, callback) {
				errorRecorded = true
				callback()
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				errorRecorded.should.be.false
				done()
			})
		})

		// Given no scum filter entries are found
		// When the wroth index page is requested from the web
		// Then an error is returned to the caller
		it ('Given no scum filter entries are found ' + 
			'When the wroth index page is requested from the web ' +
			'Then an error is returned to the caller', function(done){
			var mockRequest = function(url, callback) {
				callback(null, {body: ''})
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function(e) {
				e.should.be.type('object')
				e.message.should.equal('No scum filter entries could be found.')
				done()
			})
		})

		// Given one scum filter entry is found on the wroth
		// And one matching entry is found on the file system
		// Then the trombone is not asked to parp
		// And the scum filter on the filesystem is not written to
		it ('Given one scum filter entry is found on the wroth ' + 
			'And one matching entry is found on the file system ' +
			'Then the trombone is not asked to parp ' +
			'And the scum filter is not added to', function(done){
			var scumFilterAddedTo = false
			mockDb.getScumFilter = function(callback) {
				var scumFilter = ["ENTRY_ONE"]
				callback(null, scumFilter)
			}
			mockDb.addScumFilterEntry = function(entry, callback) {
				scumFilterAddedTo = true
				callback()
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE"]\'.evalJSON'
				})
			}
			var mockParp = function() {
				(false).should.equal(true)
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				scumFilterAddedTo.should.be.false
				done()
			})
		})

		// Given more than one scum filter entry is found on the wroth
		// And matching entries are found on the file system
		// Then the trombone is not asked to parp
		// And the scum filter on the filesystem is not written to
		it ('Given more than one scum filter entry is found on the wroth' + 
			'And matching entries are found on the file system ' +
			'Then the trombone is not asked to parp ' +
			'And the scum filter on the filesystem is not written to', function(done){
			var scumFilterAddedTo = false
			mockDb.getScumFilter = function(callback) {
				var scumFilter = ["ENTRY_ONE", "ENTRY_TWO", "ENTRY_THREE"]
				callback(null, scumFilter)
			}
			mockDb.addScumFilterEntry = function(entry, callback) {
				scumFilterAddedTo = true
				callback()
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE"]\'.evalJSON'
				})
			}
			var mockParp = function() {
				(false).should.equal(true)
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				scumFilterAddedTo.should.be.false
				done()
			})
		})

		// Given more than one scum filter entry is found on the wroth
		// And all but one matching entries are found on the file system
		// Then the trombone is asked to parp
		// And the scum filter on the filesystem is updated
		it ('Given more than one scum filter entry is found on the wroth ' + 
			'And all but one matching entries are found on the file system ' +
			'Then the trombone is asked to parp ' +
			'And the scum filter on the filesystem is updated', function(done){
			var scumFilterAddedTo = false
			var parpCalled = false
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE"]')
			mockDb.getScumFilter = function(callback) {
				var scumFilter = ["ENTRY_ONE", "ENTRY_TWO"]
				callback(null, scumFilter)
			}
			mockDb.addScumFilterEntry = function(entry, callback) {
				entry.should.equal('ENTRY_THREE')
				scumFilterAddedTo = true
				callback()
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE"]\'.evalJSON'
				})
			}
			mockParp = function(message) {
				message.should.equal("'ENTRY_THREE' added to Scum Filter.")
				parpCalled = true
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				parpCalled.should.be.true
				scumFilterAddedTo.should.be.true
				done()
			})
		})

		// Given more than one scum filter entry is found on the wroth
		// And many not matching entries are found on the file system
		// Then the trombone is asked to parp for each new entry
		// And the scum filter on the filesystem is updated
		it ('Given more than one scum filter entry is found on the wroth ' + 
			'And many not matching entries are found on the file system ' +
			'Then the trombone is asked to parp for each new entry ' +
			'And the scum filter on the filesystem is updated', function(done){
			var timesScumFilterUpdated = 0
			var parpCalled = 0
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE","ENTRY_FOUR"]')
			mockDb.getScumFilter = function(callback) {
				var scumFilter = ["ENTRY_ONE", "ENTRY_TWO"]
				callback(null, scumFilter)
			}
			mockDb.addScumFilterEntry = function(entry, callback) {
				timesScumFilterUpdated++
				callback()
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE","ENTRY_FOUR"]\'.evalJSON'
				})
			}
			var mockParp = function() {
				parpCalled ++
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				parpCalled.should.equal(2)
				timesScumFilterUpdated.should.equal(2)
				done()
			})
		})

		// Given more than one scum filter entry is found on the wroth
		// And all matching entries are found on the file system
		// And one extra entry is found on the file system
		// Then the trombone is asked to parp for the extra entry
		// And the scum filter on the filesystem is updated
		it ('Given more than one scum filter entry is found on the wroth ' + 
			'And all matching entries are found on the file system ' +
			'And one extra entry is found on the file system ' +
			'Then the trombone is asked to parp for the extra entry ' +
			'And the scum filter on the filesystem is updated', function(done){
			var entryRemovedFromScumFilter = false
			var parpCalled = false
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO"]')
			mockDb.getScumFilter = function(callback) {
				var scumFilter = ["ENTRY_ONE", "ENTRY_TWO","ENTRY_THREE"]
				callback(null, scumFilter)
			}
			mockDb.removeScumFilterEntry = function(entry, callback) {
				entry.should.equal('ENTRY_THREE')
				entryRemovedFromScumFilter = true
				callback()
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO"]\'.evalJSON'
				})
			}
			var mockParp = function(message) {
				message.should.equal("'ENTRY_THREE' removed from Scum Filter.")
				parpCalled = true
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				parpCalled.should.be.true
				entryRemovedFromScumFilter.should.be.true
				done()
			})
		})

		// Given more than one scum filter entry is found on the wroth
		// And all matching entries are found on the file system
		// And more than one extra entries are found on the file system
		// Then the trombone is asked to parp for each extra entry
		// And the scum filter on the filesystem is updated
		it ('Given more than one scum filter entry is found on the wroth ' + 
			'And all matching entries are found on the file system ' +
			'And more than one extra entries are found on the file system ' +
			'Then the trombone is asked to parp for each extra entry ' +
			'And the scum filter on the filesystem is updated', function(done){
			var timesEntriesRemovedFromScumFilter = 0
			var parpCalled = 0
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO"]')
			mockDb.getScumFilter = function(callback) {
				var scumFilter = ["ENTRY_ONE", "ENTRY_TWO","ENTRY_THREE","ENTRY_FOUR"]
				callback(null, scumFilter)
			}
			mockDb.removeScumFilterEntry = function(entry, callback) {
				timesEntriesRemovedFromScumFilter++
				callback()
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO"]\'.evalJSON'
				})
			}
			var mockParp = function(message) {
				parpCalled++
			}
			var observe = new observeModule(mockDb, mockRequest, mockParp, mockEmail)
			observe.go(function() {
				parpCalled.should.equal(2)
				timesEntriesRemovedFromScumFilter.should.equal(2)
				done()
			})
		})
	})
})
