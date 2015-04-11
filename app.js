"use strict"

var rq = require('request')

var twit = require('twit')
var parp = require('./parp')(twit)

var nm = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var emailModule = require('./email')
var email = new emailModule(nm, smtpTransport)

var pg = require('pg')
var db = require('./postgres')(pg)

var observeModule = require('./observe.js')
var observe = new observeModule(db, rq, parp, email)

observe.go(function(e) {
	console.log(e)
})




