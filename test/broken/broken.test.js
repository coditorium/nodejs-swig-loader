'use strict';

var expect = require('chai').expect,
	path = require('path'),
	load = require('../load');

describe('Error test: swig-loader', function() {

	it('should throw nicely formatted error', function(done) {
		load(path.resolve(__dirname, 'template.js'), function(err, mod) {
			expect(err).to.exist;
			expect(err.message).to.contain('Could not resolve swig template. ' +
				'Cause: Error: Unexpected tag "xyz asd" on line 1 in file ' +
				'/media/storage/Development/coditorium/code/nodejs/libs/nodejs-swig-loader/test/broken/template.html.');
			expect(mod).to.not.exist;
			done();
		});
	});

});
