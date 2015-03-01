'use strict';

var loaderUtils = require('loader-utils'),
	Swig = require('swig').Swig,
	globalOpts = {};

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var opts = loaderUtils.parseQuery(this.query),
		params = loaderUtils.parseQuery(this.resourceQuery);
	opts = mergeFlat(opts);
	content = resolve(content, this.resourcePath, opts, params, this.emitError);
	return prepareResult(content, opts);
};

module.exports.options = function(opts) {
	if (!opts) return globalOpts;
	globalOpts = opts;
};

function prepareResult(content, opts) {
	if (opts.raw) return content;
	return 'module.exports = ' + JSON.stringify(content) + ';';
}

function resolve(content, filepath, opts, params, onError) {
	var swig = new Swig(opts), // swig.render() doesn't work as documented
		result;
	try {
		result = swig.compile(content, { filename: filepath })(params);
	} catch(e) {
		onError('Could not resolve swig template. Cause: ' + e);
		return '';
	}
	return result;
}

function mergeFlat(opts) {
	var result = {};
	Object.keys(globalOpts || {}).forEach(function(key) {
		result[key] = globalOpts[key];
	});
	Object.keys(opts || {}).forEach(function(key) {
		result[key] = opts[key];
	});
	return result;
}
