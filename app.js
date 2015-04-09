"use strict"

var fs = require('fs')
var rq = require('request')

var twit = require('twit')
var parp = require('./parp')(twit)

parp('test #2')

/*
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
			trombone()
		})		
	}, seconds * 1000)
}
trombone()
*/



