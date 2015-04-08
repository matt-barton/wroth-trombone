"use strict"


var fs = require('fs')
var rq = require('request')
var parp = require('./parp')
var nm = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

var emailModule = require('./email')
var email = new emailModule(nm, smtpTransport)

var observeModule = require('./observe.js')
var observe = new observeModule(fs, rq, parp, email)

var seconds = process.env.WROTH_TROMBONE_OBSERVE_FREQUENCY

function trombone () {
	setTimeout(function() {
		observe.go(function(e){
			console.error(e)
			trombone()
		})		
	}, seconds * 1000)
}
trombone()




