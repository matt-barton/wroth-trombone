"use strict";

var should = require('should');
var tromboneModule = require('../trombone.js');

describe('trombone', function() {

	describe('observe', function() {

		var mockFs = {
			readFile: function(filename, encoding, callback) {
				callback();
			}
		};

		var mockRequest = function(url, callback) {
			callback();
		};

		it ('When trombone is observing ' + 
			'Then trombone is asked to observe.', function(done){
			var trombone = new tromboneModule(mockFs, mockRequest);
			trombone.observe();
			done();
		});

		it ('Given observing is complete ' + 
			'When trombone is observing ' + 
			'Then the provided callback is called.', function(done){
			var trombone = new tromboneModule(mockFs, mockRequest);
			trombone.observe(function() {
				done();
			});
		});

		it ('When trombone is observing ' + 
			'Then the current scum filter list is read from the file system', function(done) {
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					filename.should.equal('scumfilter.js');
					encoding.should.equal('utf8');
					callback();
				}
			};
			var trombone = new tromboneModule(mockFs, mockRequest);
			trombone.observe(function() {
				done();
			});
		});

		it ('Given an error occurs ' + 
			'When the current scum filter is read ' +
			'Then the error is passed to the callback', function(done){
			var error = new Error();
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(error);
				}
			};
			var trombone = new tromboneModule(mockFs, mockRequest);
			trombone.observe(function(e) {
				e.should.equal(error);
				done();
			});
		});

		it ('Given an error occurs ' + 
			'When the current scum filter is read ' +
			'Then the wroth index page is not requested from the web', function(done){
			var error = new Error();
			var mockFs = {
				readFile: function(filename, encoding, callback) {
					callback(error);
				}
			};
			var mockRequest = function(url, callback) {
				(true).should.equal(false);
				callback();
			};
			var trombone = new tromboneModule(mockFs, mockRequest);
			trombone.observe(function() {
				done();
			});
		});

		it ('Given an error occurs ')
		it ('When trombone is observing ' + 
			'Then the wroth index page is requested from the web', function(done) {
			var mockRequest = function(url, callback) {
				url.should.equal('http://www.wrathofthebarclay.co.uk/interactive/board/board.php');
				callback();
			};
			var trombone = new tromboneModule(mockFs, mockRequest);
			trombone.observe(function() {
				done();
			});
		});

	});

	describe('parp', function() {
		it ('no tests yet', function(done) {
			done();
		});
	});

});
