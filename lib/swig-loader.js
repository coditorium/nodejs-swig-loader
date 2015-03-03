'use strict';

var loaderUtils = require('loader-utils'),
	swig = require('swig');

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var opts = loaderUtils.parseQuery(this.query),
		params = loaderUtils.parseQuery(this.resourceQuery);
	content = resolve(content, this.resourcePath, opts, params, this.emitError);
	return prepareResult(content, opts);
};

module.exports.options = function(opts) {
	swig.setDefaults(opts);
};

function prepareResult(content, opts) {
	if (opts.raw) return content;
	return 'module.exports = ' + JSON.stringify(content) + ';';
}

function resolve(content, filepath, opts, params, onError) {
	var templateOpts = mergeShallow(opts, { filename: filepath }),
		result;
	try {
		result = swig.compile(content, templateOpts)(params);
	} catch(e) {
		onError('Could not resolve swig template. Cause: ' + e);
		return '';
	}
	return result;
}

function mergeShallow(a, b) {
	var result = {};
	Object.keys(a || {}).forEach(function(key) {
		result[key] = a[key];
	});
	Object.keys(b || {}).forEach(function(key) {
		result[key] = b[key];
	});
	return result;
}
