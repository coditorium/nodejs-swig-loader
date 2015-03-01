'use strict';

var webpack = require('webpack'),
	path = require('path'),
	projectDir = path.resolve(__dirname, '..'),
	tmpDir = path.resolve(projectDir, 'build/test/tmp');

module.exports = function(filepath, callback) {
	var filename = path.basename(filepath),
		dirname = path.dirname(filepath),
		outputdir = path.resolve(tmpDir, dirname.substring((projectDir + '/test/').length)),
		outputfile = path.resolve(outputdir, filename);
	webpack({
		entry: filepath,
		output: {
			path: outputdir,
			filename: filename,
			libraryTarget: 'commonjs2'
		},
		module: {
			loaders: [
				{ test: /\.html(\?.*)?$/, loader: projectDir }
			]
		}
	}, function(err, stats) {
		if (err) return callback(err);
		if (stats.hasErrors()) return callback(stats.compilation.errors[0]);
		if (stats.hasWarnings()) return callback(stats.compilation.warnings[0]);
		callback(null, require(outputfile));
	});
};
