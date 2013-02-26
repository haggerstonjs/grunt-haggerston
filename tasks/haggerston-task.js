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

var Haggerston = require('../tasks/lib/haggerston');

module.exports = function(grunt) {
  grunt.registerTask('haggerston', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
          src: 'src',
          out: 'out',
          generateFunctions: {},
          swigFilters: {},
          swigTags: {},
          swigExtensions: {}
        });

    if (!grunt.file.isDir(options.src)) {
      grunt.fail.warn('options.src is not a valid directory');
    }

    var contentPath = options.contentPath || path.join(options.src, 'content');
    var templatesPath = options.templatesPath || path.join(options.src, 'templates');

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

    var haggerston = new Haggerston(contentPath, options.generateFunctions);

    // Render each file page to a file
    haggerston.pages.forEach(function(page) {
      var outFilePath = path.join(options.out, page.url);
      grunt.verbose.writeln('Generating ' + page.jsonFile.cyan + ' -> ' + outFilePath.cyan);
      grunt.file.write(outFilePath, page.render(haggerston));
    });

  });
};
