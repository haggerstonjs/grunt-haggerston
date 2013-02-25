/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    swig = require('swig');

var Page = require('./lib/page');

module.exports = function(grunt) {
  grunt.registerTask('haggerston', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
          src: 'src',
          out: 'out'
        });

    if (!grunt.file.isDir(options.src)) {
      grunt.fail.warn('options.src is not a valid directory');
    }

    // Set base path that swig will look inside for template files
    swig.init({
      root: options.src + '/templates'
    });

    // This is the base from which actual page paths start
    var baseContentPath = path.join(options.src, 'content') + path.sep;

    // Grab array of json file paths from the src folder
    var jsonPaths = grunt.file.expand(options.src + '/**/*.json');

    var pages = [];

    // Create a Page object for each .json file found in the content path
    jsonPaths.forEach(function(jsonPath) {
      var page = new Page(baseContentPath, jsonPath.substr(baseContentPath.length), grunt.file.readJSON(jsonPath));
      pages.push(page);
    });

    // Render each file page to a file
    pages.forEach(function(page) {
      var outFilePath = path.normalize(options.out + path.sep + page.directory + path.sep + path.basename(page.filename, '.json') + '.html');
      grunt.file.write(outFilePath, page.render());
    });

  });
};
