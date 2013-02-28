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
          dest: 'out',
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
        require('./lib/swig/filters'),
        options.swigFilters
      ),
      tags: options.swigTags,
      extensions: options.swigExtensions
    });

    var haggerston = new Haggerston(contentPath);

    haggerston.use(require('./lib/middleware/markdown')());

    haggerston.render(options.dest);

  });
};
