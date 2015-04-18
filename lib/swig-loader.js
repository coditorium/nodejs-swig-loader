'use strict';

var loaderUtils = require('loader-utils'),
	Swig = new require('swig').Swig,
	defaultOpts = {},
	noop = function() {},
	noopr = function(r) { return r; },
	queryCustomizer = noop,
	resourceQueryCustomizer = noop,
	resultCustomizer = noopr;

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var query = loaderUtils.parseQuery(this.query),
		resourceQuery = loaderUtils.parseQuery(this.resourceQuery);
	content = resolve(content, this.resourcePath, query, resourceQuery, this.emitError);
	return prepareResult(content, query);
};

module.exports.options = function(opts) {
	if (!opts) return;
	if (typeof opts !== 'object') return;
	if (Array.isArray(opts)) return;
	defaultOpts = opts;
};

module.exports.queryCustomizer = function(customizer) {
	queryCustomizer = customizer || noop;
};

module.exports.resourceQueryCustomizer = function(customizer) {
	resourceQueryCustomizer = customizer || noop;
};

module.exports.resultCustomizer = function(customizer) {
	resultCustomizer = customizer || noopr;
};

function prepareResult(content, opts) {
	if (opts.raw) return content;
	if (typeof content === 'string' && content.indexOf('module.exports') === 0) return content;
	return 'module.exports = ' + JSON.stringify(content) + ';';
}

function resolve(content, filepath, query, resourceQuery, onError) {
	var templateOpts, swig, result;
	resourceQueryCustomizer(resourceQuery, filepath);
	queryCustomizer(query, filepath);
	templateOpts = assign({}, defaultOpts, query);
	swig = new Swig(templateOpts);
	try {
		result = swig.render(content, {
			locals: resourceQuery,
			filename: filepath
		});
	} catch(e) {
		onError('Could not resolve swig template. Cause: ' + e);
		return '';
	}
	result = resultCustomizer(result, filepath, templateOpts, resourceQuery);
	return result;
}

function assign(result) {
	var args = Array.prototype.slice.call(arguments, 1);
	args.forEach(function(a) {
		Object.keys(a || {}).forEach(function(key) {
			result[key] = a[key];
		});
	});
	return result;
}
