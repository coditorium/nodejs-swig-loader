'use strict';

var loaderUtils = require('loader-utils'),
	Swig = require('swig').Swig;

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var opts = loaderUtils.parseQuery(this.query),
		params = loaderUtils.parseQuery(this.resourceQuery);
	content = resolve(content, this.resourcePath, opts, params, this.emitError);
	return prepareResult(content, opts);
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
