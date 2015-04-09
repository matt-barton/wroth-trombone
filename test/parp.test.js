'use strict'

"use strict"

var should = require('should')

describe('trombone', function() {

	describe('parp', function () {

		var mockTwitObject

		beforeEach(function(done) {

			mockTwitObject = {
				post: function(a, b, c) {
					if (typeof c == 'function') c()
				}
			}
			done()
		})

		// Given no twit object is established
		// When parp is asked to parp
		// Then a twit object is created
		it ('Given no twit object is established ' +
		'When parp is asked to parp ' +
		'Then a twit object is created', function(done) {
			var twitObjectEstablished = false
			function mockTwit() {
				twitObjectEstablished = true
				return mockTwitObject
			}
			var parp = require('../parp.js')(mockTwit)
			parp('', function() {
				twitObjectEstablished.should.be.true
				done()
			})

		})

		// Given a twit object is established
		// When parp is asked to parp
		// Then a twit object is not created
		it ('Given a twit object is established ' +
		'When parp is asked to parp ' +
		'Then a twit object is not created', function(done) {
			var twitObjectEstablished = 0
			function mockTwit () {
				twitObjectEstablished ++
				return mockTwitObject
			}
			var parp = require('../parp.js')(mockTwit)
			parp('', function() {
				parp('', function() {
					twitObjectEstablished.should.equal(1)
					done()
				})
			})
		})

		// Given no twit object is established
		// When parp is asked to parp
		// Then a twit object is created with details from environment variables
		it ('Given no twit object is established ' +
		'When parp is asked to parp ' +
		'Then a twit object is created with details from environment variables', function(done) {
			var twitObjectEstablished = false
			process.env.WROTH_TROMBONE_TWITTER_CONSUMER_KEY = 'CONSUMER_KEY'
			process.env.WROTH_TROMBONE_TWITTER_CONSUMER_SECRET = 'CONSUMER_SECRET'
			process.env.WROTH_TROMBONE_TWITTER_ACCESS_TOKEN = 'ACCESS_TOKEN'
			process.env.WROTH_TROMBONE_TWITTER_ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET'
			function mockTwit(details) {
				twitObjectEstablished = true
				details.should.be.type('object')
				details.consumer_key.should.equal('CONSUMER_KEY')
				details.consumer_secret.should.equal('CONSUMER_SECRET')
				details.access_token.should.equal('ACCESS_TOKEN')
				details.access_token_secret.should.equal('ACCESS_TOKEN_SECRET')
				return mockTwitObject
			}
			var parp = require('../parp.js')(mockTwit)
			parp('', function() {
				twitObjectEstablished.should.be.true
				done()
			})
		})

		// Given a twit object is established
		// When parp is asked to parp
		// Then a tweet is posted
		it ('Given a twit object is established ' +
		'When parp is asked to parp ' +
		'Then a tweet is posted', function(done) {
			var message = 'this is the message to tweet'
			var tweetPosted = false
			mockTwitObject.post = function(what, messageObject, callback) {
				tweetPosted = true
				what.should.equal('statuses/update')
				messageObject.should.be.type('object')
				messageObject.status.should.equal(message)
				callback()
			}
			function mockTwit(details) {
				return mockTwitObject
			}
			var parp = require('../parp.js')(mockTwit)
			parp(message, function() {
				tweetPosted.should.be.true
				done()
			})
		})
	})
})
