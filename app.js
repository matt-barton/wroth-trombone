"use strict"

var fs = require('fs')
var rq = require('request')

var tromboneModule = require('./trombone.js')
var trombone = new tromboneModule(fs, rq)

trombone.observe(function(e){
	console.error(e)
})

