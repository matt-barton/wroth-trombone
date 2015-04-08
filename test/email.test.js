"use strict"

var should = require('should')
var emailModule = require('../email')

describe('trombone', function() {

	describe('email', function() {

		var mockSmtpTransport
		var mockTransport
		beforeEach(function(done){
			process.env.WROTH_TROMBONE_EMAIL_SMTP_HOST = 'SMTP_HOST'
			process.env.WROTH_TROMBONE_EMAIL_SMTP_PORT = 'SMTP_PORT'
			process.env.WROTH_TROMBONE_EMAIL_USERNAME = 'EMAIL_USERNAME'
			process.env.WROTH_TROMBONE_EMAIL_PASSWORD = 'EMAIL_PASSWORD'
			process.env.WROTH_TROMBONE_EMAIL_RECIPIENT = 'EMAIL_RECIPIENT'
			process.env.WROTH_TROMBONE_EMAIL_FROM = 'EMAIL_FROM'
			
			mockSmtpTransport = function () {}
			mockTransport = {
				sendMail: function(options, callback) {
					if (typeof callback == 'function') return callback()
				}
			}
			done()
		})

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
					return mockTransport
				}
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
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
					return mockTransport
				}
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
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
					return mockTransport
				}
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
			email.resumption(function() {
				transportCreated.should.be.true
				done()
			})
		})

		// Given that a transport has already been created
		// When a resumption email is requested
		// Then a new transport is not created
		it('Given that a transport has already been created ' +
			'When a resumption email is requested ' +
			'Then a new transport is not created', function(done){
			var transportCreatedCount = 0
			var mockMailer = {
				createTransport: function() {
					transportCreatedCount++
					return mockTransport
				}
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
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
			'Then a new transport is created from an smtp transport', function(done) {
			var transportCreated = false
			var smtpTransportUsed = false
			var mockMailer = {
				createTransport: function() {
					transportCreated = true
					return mockTransport
				}
			}

			var mockSmtpTransport = function() {
				smtpTransportUsed = true
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
			email.error(function() {
				smtpTransportUsed.should.be.true
				done()
			})
		})

		// Given that no transport exists
		// When a resumption email is requested
		// Then a new transport is created with details from environment variables
		it ('Given that no transport exists ' +
			'When a resumption email is requested ' +
			'Then a new transport is created from an smtp transport', function(done) {
			var transportCreated = false
			var smtpTransportUsed = false
			var mockMailer = {
				createTransport: function() {
					transportCreated = true
					return mockTransport
				}
			}
			var mockSmtpTransport = function() {
				smtpTransportUsed = true
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
			email.resumption(function() {
				smtpTransportUsed.should.be.true
				done()
			})
		})

		// Given no transport exists
		// When an error email is requested
		// Then an smtp transport is created, with options from environment variables
		it('Given no transport exists ' +
			'When an error email is requested ' + 
			'Then an smtp transport is created, with options from environment variables', function(done){
			var mockMailer = {
				createTransport: function() {
					return mockTransport
				}
			}
			var smtpTransportUsed = false
			var mockSmtpTransport = function(options) {
				smtpTransportUsed = true
				options.should.be.type('object')
				options.host.should.equal('SMTP_HOST')
				options.port.should.equal('SMTP_PORT')
				options.auth.should.be.type('object')
				options.auth.user.should.equal('EMAIL_USERNAME')
				options.auth.pass.should.equal('EMAIL_PASSWORD')
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
			email.error(function() {
				smtpTransportUsed.should.be.true
				done()
			})
		})

		// Given no transport exists
		// When a resumption email is requested
		// Then an smtp transport is created, with options from environment variables
		it('Given no transport exists ' +
			'When a resumption email is requested ' + 
			'Then an smtp transport is created, with options from environment variables', function(done){
			var mockMailer = {
				createTransport: function() {
					return mockTransport
				}
			}
			var smtpTransportUsed = false
			var mockSmtpTransport = function(options) {
				smtpTransportUsed = true
				options.should.be.type('object')
				options.host.should.equal('SMTP_HOST')
				options.port.should.equal('SMTP_PORT')
				options.auth.should.be.type('object')
				options.auth.user.should.equal('EMAIL_USERNAME')
				options.auth.pass.should.equal('EMAIL_PASSWORD')
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
			email.resumption(function() {
				smtpTransportUsed.should.be.true
				done()
			})
		})
		// When an error email is requested
		// Then an error email is sent
		it('When an error email is requested ' + 
			'Then an error email is sent', function(done){
			var emailSent = false
			var mockMailer = {
				createTransport: function () {
					return {
						sendMail: function (options, callback) {
							emailSent = true
							options.should.be.type('object')
							options.from.should.equal('EMAIL_FROM')
							options.to.should.equal('EMAIL_RECIPIENT')
							options.subject.should.equal('Wroth Trombone: Error')
							options.text.should.equal('This is the Wroth Trombone.  I encountered an error reading the Scum Filter from Wroth.')
							callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
			email.error(function() {
				emailSent.should.be.true
				done()
			})
		})

		// When a resumption email is requested
		// Then a resumption email is sent
		it('When a resumption email is requested ' + 
			'Then a resumption email is sent', function(done){
			var emailSent = false
			var mockMailer = {
				createTransport: function () {
					return {
						sendMail: function (options, callback) {
							emailSent = true
							options.should.be.type('object')
							options.from.should.equal('EMAIL_FROM')
							options.to.should.equal('EMAIL_RECIPIENT')
							options.subject.should.equal('Wroth Trombone: Service Resumed')
							options.text.should.equal('This is the Wroth Trombone.  Previous errors have cleared, and service has resumed.')
							callback()
						}
					}
				}
			}
			var email = new emailModule(mockMailer, mockSmtpTransport)
			email.resumption(function() {
				emailSent.should.be.true
				done()
			})
		})
	})
})
