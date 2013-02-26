/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var swig = require('swig');
var _ = require('underscore');

var Haggerston = require('./lib/haggerston');

module.exports = function(grunt) {
  grunt.registerTask('haggerston', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
          src: 'src',
          out: 'out',
          swigFilters: {},
          swigTags: {},
          swigExtensions: {}
        });

    if (!grunt.file.isDir(options.src)) {
      grunt.fail.warn('options.src is not a valid directory');
    }

    var contentPath = path.join(options.src, 'content');
    var templatesPath = path.join(options.src, 'templates');

    // Initialise swig with the relevant options
    swig.init({
      root: templatesPath,
      filters: _.extend(
        {},
        require('./lib/haggerston-filters'),
        options.swigFilters
      ),
      tags: options.swigTags,
      extensions: options.swigExtensions
    });

    // Grab array of json file paths from the src folder
    var jsonFiles = grunt.file.expand(options.src + '/**/*.json');

    var haggerston = new Haggerston(contentPath, jsonFiles);

    // Render each file page to a file
    haggerston.pages.forEach(function(page) {
      var outFilePath = path.join(options.out, page.url);
      grunt.verbose.writeln('Generating ' + page.jsonFile.cyan + ' -> ' + outFilePath.cyan);
      grunt.file.write(outFilePath, page.render());
    });

  });
};
