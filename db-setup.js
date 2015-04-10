'use strict'

var pg = require('pg')

var client = new pg.Client(process.env.WROTH_TROMBONE_WROTH_URL)
client.connect(function(err) {
 	if(err) return console.error('could not connect to postgres', err)
	client.query ('CREATE TABLE IF NOT EXISTS error(error varchar(999999))', function(err, result) {
		if(err) return console.error('error running query', err)
		client.query ('CREATE TABLE IF NOT EXISTS scumfilter (username varchar(200))', function(err, result) {
			if(err) return console.error('error running query', err)
			  client.end();
		})
	})
})
