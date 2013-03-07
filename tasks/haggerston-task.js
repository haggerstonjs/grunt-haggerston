/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var swig = require('swig');
var _ = require('underscore');

var Haggerston = require('../tasks/lib/haggerston');

module.exports = function(grunt) {
  grunt.registerTask('haggerston', 'Your task description goes here.', function() {
    // The render function is async and will call done() when finished
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        src: 'src',
        dest: 'out',
        middleware: require('./lib/middleware/default')
      });

    // Create defaults for the content & template paths if not been specified in the options
    options.contentPath = options.contentPath || path.join(options.src, 'content');
    options.templatesPath = options.templatesPath || path.join(options.src, 'templates');

    if (!grunt.file.isDir(options.src)) {
      grunt.fail.warn(options.src + ' is not a directory.');
    }

    if (!grunt.file.isDir(options.contentPath)) {
      grunt.fail.warn(options.contentPath + ' is not a directory.');
    }

    if (!grunt.file.isDir(options.templatesPath)) {
      grunt.fail.warn(options.templatesPath + ' is not a directory.');
    }

    // Initialise swig with the relevant options
    swig.init({
      root: options.templatesPath,
      filters: _.extend(
        {},
        require('./lib/swig/filters'),
        options.swigFilters
      ),
      tags: options.swigTags,
      extensions: options.swigExtensions
    });

    var haggerston = new Haggerston(options);

    _(options.middleware).each(function(middleware) {
      haggerston.use(middleware);
    });

    // Load the pages, run the middleware, then write them to files.
    // This will call the async done method when finished.
    haggerston.start(options.dest, done);
  });
};
