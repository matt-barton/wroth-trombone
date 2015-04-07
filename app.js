"use strict"

var fs = require('fs')
var rq = require('request')
var parp = require('./parp')

var emailModule = require('./email')
var email = new emailModule()

var observeModule = require('./observe.js')
var observe = new observeModule(fs, rq, parp, email)

observe.go(function(e){
	console.error(e)
})
