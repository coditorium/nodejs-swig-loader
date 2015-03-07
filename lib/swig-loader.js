'use strict';

var loaderUtils = require('loader-utils'),
	Swig = new require('swig').Swig,
	defaultOpts = {};

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var opts = loaderUtils.parseQuery(this.query),
		params = loaderUtils.parseQuery(this.resourceQuery);
	content = resolve(content, this.resourcePath, opts, params, this.emitError);
	return prepareResult(content, opts);
};

module.exports.options = function(opts) {
	if (!opts) return;
	if (typeof opts !== 'object') return;
	if (Array.isArray(opts)) return;
	defaultOpts = opts;
};

function prepareResult(content, opts) {
	if (opts.raw) return content;
	return 'module.exports = ' + JSON.stringify(content) + ';';
}

function resolve(content, filepath, opts, params, onError) {
	var templateOpts = mergeShallow(defaultOpts, opts),
		swig = new Swig(templateOpts),
		result;
	try {
		result = swig.render(content, {
			locals: params,
			filename: filepath
		});
	} catch(e) {
		onError('Could not resolve swig template. Cause: ' + e);
		return '';
	}
	return result;
}

function mergeShallow() {
	var args = Array.prototype.slice.call(arguments),
		result = {};
	args.forEach(function(a) {
		Object.keys(a || {}).forEach(function(key) {
			result[key] = a[key];
		});
	});
	return result;
}
