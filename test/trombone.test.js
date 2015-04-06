"use strict"

var should = require('should')
var tromboneModule = require('../trombone.js')

describe('trombone', function() {

	var mockFs = {
		readFile: function(filename, encoding, callback) {
			callback(null, '[]')
		}
	}

	var mockRequest = function(url, callback) {
		callback(null, {body: ''})
	}

	describe('observe', function() {

		// When trombone is observing
		// Then trombone is asked to observe.
		it ('When trombone is observing ' + 
			'Then trombone is asked to observe.', function(done){
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe()
			done()
		})

		// Given observing is complete 
		// When trombone is observing 
		// Then the provided callback is called.
		it ('Given observing is complete ' + 
			'When trombone is observing ' + 
			'Then the provided callback is called.', function(done){
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function() {
				done()
			})
		})

		// When trombone is observing
		// Then the current scum filter list is read from the file system
		it ('When trombone is observing ' + 
			'Then the current scum filter list is read from the file system', function(done) {
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					filename.should.equal('scumfilter.js')
					encoding.should.equal('utf8')
					callback(null, '[]')
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function() {
				done()
			})
		})

		//Given an error occurs
		// When the current scum filter is read
		// Then the error is passed to the callback
		it ('Given an error occurs ' + 
			'When the current scum filter is read ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error()
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(error)
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
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
			var error = new Error()
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(error)
				}
			}
			var mockRequest = function(url, callback) {
				(true).should.equal(false)
				callback(null, {body: ''})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function() {
				done()
			})
		})

		// Given an error occurs
		// And the error is ENOENT
		// When the current scum filter is read
		// Then the error is not passed to the callback
		it ('Given an error occurs ' +
			'And the error is ENOENT ' +
			'When the current scum filter is read ' +
			'Then the error is not passed to the callback', function(done){
			var error = new Error()
			error.code = 'ENOENT'
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(error, '[]')
				},

				writeFile: function(filename, data, callback) {
					callback(null)
				}
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["test"]\'.evalJSON'
				})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.overrideParp(function() {})
			trombone.observe(function(e) {
				(e === null).should.equal(true)
				done()
			})
		})

		// Given an error occurs
		// And the error is ENOENT
		// When the current scum filter is read
		// Then an empty scum filter is saved to the file system
		it ('Given an error occurs ' +
			'And the error is ENOENT ' +
			'When the current scum filter is read ' +
			'Then an empty scum filter is saved to the file system', function(done){
			var error = new Error()
			error.code = 'ENOENT'
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(error, '[]')
				},

				writeFile: function(filename, data, callback) {
					filename.should.equal('scumfilter.js')
					data.should.equal('[]');
					callback();
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
				done()
			})
		})

		// Given an error occurs
		// And the error is ENOENT
		// When the current scum filter is read
		// And an error occurs when a blank scum filter is written
		// Then the second error is passed to the callback
		it ('Given an error occurs ' +
			'And the error is ENOENT ' +
			'When the current scum filter is read ' +
			'And an error occurs when a blank scum filter is written ' +
			'Then the second error is passed to the callback', function(done){
			var errorOne = new Error
			errorOne.code = 'ENOENT'
			var errorTwo = new Error
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(errorOne, '[]')
				},

				writeFile: function(filename, data, callback) {
					callback(errorTwo)
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
				e.should.equal(errorTwo)
				done()
			})
		})

		// Given an error occurs
		// And the error is ENOENT
		// When the current scum filter is read
		// And an error occurs when a blank scum filter is written
		// Then the wroth index page is not requested from the web
		it ('Given an error occurs ' +
			'And the error is ENOENT ' +
			'When the current scum filter is read ' +
			'And an error occurs when a blank scum filter is written ' +
			'Then the wroth index page is not requested from the web ', function(done){
			var errorOne = new Error
			errorOne.code = 'ENOENT'
			var errorTwo = new Error
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(errorOne, '[]')
				},

				writeFile: function(filename, data, callback) {
					callback(errorTwo)
				}
			}
			var mockRequest = function(url, callback) {
				(true).should.equal(false)
				callback()
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function() {
				done()
			})
		})
		
		// When trombone is observing
		// Then the wroth index page is requested from the web
		it ('When trombone is observing ' + 
			'Then the wroth index page is requested from the web', function(done) {
			var mockRequest = function(url, callback) {
				url.should.equal('http://www.wrathofthebarclay.co.uk/interactive/board/board.php')
				callback(null, {body: ''})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function() {
				done()
			})
		})		

		// Given an error occurs
		// When the wroth index page is requested from the web
		// Then the error is passed back to the caller
		it ('Given an error occurs ' + 
			'When the wroth index page is requested from the web ' + 
			'Then the error is passed back to the caller', function(done) {
			var error = new Error
			var mockRequest = function(url, callback) {
				callback(error)
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
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
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					if (filename == 'scumfilter.js') return callback(null, '[]') 
					errorChecked = true
					filename.should.equal('error.js')
					callback(null, '[]')
				},
				writeFile: function(filename, data, callback) {
					callback()
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
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
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					if (filename == 'error.js') {
						var e = new Error
						e.code = 'ENOENT'
						callback(e)
					}
					else {
						callback(null, '[]')
					}
				},
				writeFile: function(filename, data, callback) {
					errorRecorded = true
					filename.should.equal('error.js')
					data.should.equal(JSON.stringify(error))
					callback()
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
				errorRecorded.should.be.true;
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
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					if (filename == 'error.js') {
						var e = new Error
						e.code = 'ENOENT'
						callback(e)
					}
					else {
						callback(null, '[]')
					}
				},
				writeFile: function(filename, data, callback) {
					callback()
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.overrideEmail(function() {
				emailRequested = true
			})
			trombone.observe(function(e) {
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
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					if (filename == 'scumfilter.js') return callback(null, '[]') 
					callback(null, JSON.stringify(error))
				},
				writeFile: function(filename, data, callback) {
					callback()
				}
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.overrideEmail(function(message) {
				emailRequested = true
				message.should.equal('Wroth service is resumed')
			})
			trombone.observe(function(e) {
				emailRequested.should.be.true;
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
			var error = new Error
			var mockRequest = function(url, callback) {
				callback(error)
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
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
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.observe(function(e) {
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
			'And the scum filter on the filesystem is not written to', function(done){
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					var scumFilter = JSON.stringify(["ENTRY_ONE"])
					callback(null, scumFilter)
				},
				writeFile: function(filename, data, callback) {
					(false).should.equal(true)
					callback()
				}
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE"]\'.evalJSON'
				})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.parp = function() {
				(false).should.equal(true)
			}
			trombone.observe(function() {
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
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					var scumFilter = JSON.stringify(["ENTRY_ONE", "ENTRY_TWO", "ENTRY_THREE"])
					callback(null, scumFilter)
				},
				writeFile: function(filename, data, callback) {
					(false).should.equal(true)
					callback()
				}
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE"]\'.evalJSON'
				})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.parp = function() {
				(false).should.equal(true)
			}
			trombone.observe(function() {
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
			var writeFileCalled = false;
			var parpCalled = false;
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE"]')
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					var scumFilter = JSON.stringify(["ENTRY_ONE", "ENTRY_TWO"])
					callback(null, scumFilter)
				},
				writeFile: function(filename, data, callback) {
					filename.should.equal('scumfilter.js')
					data.should.equal(JSON.stringify(webScumfilter))
					writeFileCalled = true;
					callback()
				}
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE"]\'.evalJSON'
				})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.overrideParp(function(message) {
				message.should.equal("ENTRY_THREE added to Scum Filter.")
				parpCalled = true;
			})
			trombone.observe(function() {
				parpCalled.should.equal(true);
				writeFileCalled.should.equal(true);
				done()
			})
		})

		// Given more than one scum filter entry is found on the wroth
		// And many not matching entries are found on the file system
		// Then the trombone is asked to parp for each new entry
		// And the scum filter on the filesystem is updated
		it ('Given more than one scum filter entry is found on the wroth ' + 
			'And many not matching entries are found on the file system ' +
			'Then the trombone is asked to parp for each new entry' +
			'And the scum filter on the filesystem is updated', function(done){
			var writeFileCalled = false
			var parpCalled = 0
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE","ENTRY_FOUR"]')
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					var scumFilter = JSON.stringify(["ENTRY_ONE", "ENTRY_TWO"])
					callback(null, scumFilter)
				},
				writeFile: function(filename, data, callback) {
					filename.should.equal('scumfilter.js')
					data.should.equal(JSON.stringify(webScumfilter))
					writeFileCalled = true
					callback()
				}
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO","ENTRY_THREE","ENTRY_FOUR"]\'.evalJSON'
				})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.overrideParp(function() {
				parpCalled ++
			})
			trombone.observe(function() {
				parpCalled.should.equal(2);
				writeFileCalled.should.equal(true);
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
			'Then the trombone is asked to parp for the extra entry' +
			'And the scum filter on the filesystem is updated', function(done){
			var writeFileCalled = false
			var parpCalled = false
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO"]')
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					var scumFilter = JSON.stringify(["ENTRY_ONE", "ENTRY_TWO","ENTRY_THREE"])
					callback(null, scumFilter)
				},
				writeFile: function(filename, data, callback) {
					filename.should.equal('scumfilter.js')
					data.should.equal(JSON.stringify(webScumfilter))
					writeFileCalled = true
					callback()
				}
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO"]\'.evalJSON'
				})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.overrideParp(function(message) {
				message.should.equal("ENTRY_THREE removed from Scum Filter.")
				parpCalled = true
			})
			trombone.observe(function() {
				parpCalled.should.be.true
				writeFileCalled.should.be.true
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
			'Then the trombone is asked to parp for each extra entry' +
			'And the scum filter on the filesystem is updated', function(done){
			var writeFileCalled = false
			var parpCalled = 0
			var webScumfilter = JSON.parse('["ENTRY_ONE","ENTRY_TWO"]')
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					var scumFilter = JSON.stringify(["ENTRY_ONE", "ENTRY_TWO","ENTRY_THREE","ENTRY_FOUR"])
					callback(null, scumFilter)
				},
				writeFile: function(filename, data, callback) {
					filename.should.equal('scumfilter.js')
					data.should.equal(JSON.stringify(webScumfilter))
					writeFileCalled = true
					callback()
				}
			}
			var mockRequest = function(url, callback) {
				callback(null, {
					body: 'var scum = \'["ENTRY_ONE","ENTRY_TWO"]\'.evalJSON'
				})
			}
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.overrideParp(function(message) {
				parpCalled++
			})
			trombone.observe(function() {
				parpCalled.should.equal(2)
				writeFileCalled.should.be.true
				done()
			})
		})

	})

	describe('parp', function() {
		it ('When trombone needs to parp ' + 
			'Then parp is invoked', function(done) {
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.parp()
			done()
		})
	})


	describe('email', function() {
		it ('When trombone needs to email ' + 
			'Then email is invoked', function(done) {
			var trombone = new tromboneModule(mockFs, mockRequest, true)
			trombone.email()
			done()
		})
	})

})
