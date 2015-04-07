"use strict"

var should = require('should')
var emailModule = require('../email')

describe('trombone', function() {

	describe('email', function() {

		// Given that no transport exists
		// When an error email is requested
		// Then a new transport is created
		it ('Given that no transport exists ' +
			'When an error email is requested ' +
			'Then a new transport is created', function(done) {
			var transportCreated = false
			var mockMailer = {
				createTransport: function() {
					transportCreated = true
					return {
						sendMail: function(options, callback) {
							if (typeof callback == 'function') return callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.error(function() {
				transportCreated.should.be.true
				done()
			})
		})

		// Given that a transport has already been created
		// When an error email is requested
		// Then a new transport is created
		it('Given that a transport has already been created ' +
			'When an error email is requested ' +
			'Then a new transport is created', function(done){
			var transportCreatedCount = 0
			var mockMailer = {
				createTransport: function() {
					transportCreatedCount++
					return {
						sendMail: function(options, callback) {
							if (typeof callback == 'function') return callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.error(function() {
				email.error(function() {
					transportCreatedCount.should.equal(1)
					done()
				})
			})
		})

		// Given that no transport exists
		// When a resumption email is requested
		// Then a new transport is created
		it ('Given that no transport exists ' +
			'When a resumption email is requested ' +
			'Then a new transport is created', function(done) {
			var transportCreated = false
			var mockMailer = {
				createTransport: function() {
					transportCreated = true
					return {
						sendMail: function(options, callback) {
							if (typeof callback == 'function') return callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.resumption(function() {
				transportCreated.should.be.true
				done()
			})
		})

		// Given that a transport has already been created
		// When a resumption email is requested
		// Then a new transport is created
		it('Given that a transport has already been created ' +
			'When a resumption email is requested ' +
			'Then a new transport is created', function(done){
			var transportCreatedCount = 0
			var mockMailer = {
				createTransport: function() {
					transportCreatedCount++
					return {
						sendMail: function(options, callback) {
							if (typeof callback == 'function') return callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.resumption(function() {
				email.resumption(function() {
					transportCreatedCount.should.equal(1)
					done()
				})
			})
		})

		// Given that no transport exists
		// When an error email is requested
		// Then a new transport is created with details from environment variables
		it ('Given that no transport exists ' +
			'When an error email is requested ' +
			'Then a new transport is created with details from environment variables', function(done) {
			var transportCreated = false
			process.env.WROTH_TROMBONE_EMAIL_SERVICE = 'EMAIL_SERVICE'
			process.env.WROTH_TROMBONE_EMAIL_USERNAME = 'EMAIL_USERNAME'
			process.env.WROTH_TROMBONE_EMAIL_PASSWORD = 'EMAIL_PASSWORD'

			var mockMailer = {
				createTransport: function(options) {
					transportCreated = true
					options.should.be.type('object')
					options.service.should.equal('EMAIL_SERVICE')
					options.auth.should.be.type('object')
					options.auth.user.should.equal('EMAIL_USERNAME')
					options.auth.pass.should.equal('EMAIL_PASSWORD')
					return {
						sendMail: function(options, callback) {
							if (typeof callback == 'function') return callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.error(function() {
				transportCreated.should.be.true
				done()
			})
		})

		// Given that no transport exists
		// When a resumption email is requested
		// Then a new transport is created with details from environment variables
		it ('Given that no transport exists ' +
			'When a resumption email is requested ' +
			'Then a new transport is created with details from environment variables', function(done) {
			var transportCreated = false
			process.env.WROTH_TROMBONE_EMAIL_SERVICE = 'EMAIL_SERVICE'
			process.env.WROTH_TROMBONE_EMAIL_USERNAME = 'EMAIL_USERNAME'
			process.env.WROTH_TROMBONE_EMAIL_PASSWORD = 'EMAIL_PASSWORD'
			var mockMailer = {
				createTransport: function(options) {
					transportCreated = true
					options.should.be.type('object')
					options.service.should.equal('EMAIL_SERVICE')
					options.auth.should.be.type('object')
					options.auth.user.should.equal('EMAIL_USERNAME')
					options.auth.pass.should.equal('EMAIL_PASSWORD')
					return {
						sendMail: function(options, callback) {
							if (typeof callback == 'function') return callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.resumption(function() {
				transportCreated.should.be.true
				done()
			})
		})

		// When an error email is requested
		// Then an error email is sent
		it('When an error email is requested ' + 
			'Then an error email is sent', function(done){
			process.env.WROTH_TROMBONE_EMAIL_USERNAME = 'EMAIL_USERNAME'
			process.env.WROTH_TROMBONE_EMAIL_RECIPIENT = 'EMAIL_RECIPIENT'
			var emailSent = false
			var mockMailer = {
				createTransport: function () {
					return {
						sendMail: function (options, callback) {
							emailSent = true
							options.should.be.type('object')
							options.from.should.equal('EMAIL_USERNAME')
							options.to.should.equal('EMAIL_RECIPIENT')
							options.subject.should.equal('Wroth Trombone: Error')
							options.text.should.equal('This is the Wroth Trombone.  I encountered an error reading the Scum Filter from Wroth.')
							callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.error(function() {
				emailSent.should.be.true
				done()
			})
		})

		// When a resumption email is requested
		// Then a resumption email is sent
		it('When an error email is requested ' + 
			'Then an error email is sent', function(done){
			process.env.WROTH_TROMBONE_EMAIL_USERNAME = 'EMAIL_USERNAME'
			process.env.WROTH_TROMBONE_EMAIL_RECIPIENT = 'EMAIL_RECIPIENT'
			var emailSent = false
			var mockMailer = {
				createTransport: function () {
					return {
						sendMail: function (options, callback) {
							emailSent = true
							options.should.be.type('object')
							options.from.should.equal('EMAIL_USERNAME')
							options.to.should.equal('EMAIL_RECIPIENT')
							options.subject.should.equal('Wroth Trombone: Service Resumed')
							options.text.should.equal('This is the Wroth Trombone.  Previous errors have cleared, and service has resumed.')
							callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer)
			email.resumption(function() {
				emailSent.should.be.true
				done()
			})
		})
	})
})
