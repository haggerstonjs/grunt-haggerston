/*
 * grunt-haggerston
 * https://github.com/haggerstonjs/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var path = require('path');
var grunt = require('grunt');
var marked = require('marked');
var swig = require('swig');

module.exports = function() {
  'use strict';

  return function markdown(pages, next, options) {
    var mdRegExp = /\.md$/;
    _(pages).each(function(page) {
      // Recursively loop over every property of the page
      _(page).deepEach(function(value, key, obj) {
        // Search for string values ending in '.json'
        if (_.isString(value) && value.match(mdRegExp)) {
          // Absolute urls are based off the contentPath, not the OS file system
          var filePath;
          if (grunt.file.isPathAbsolute(value)) {
            filePath = path.join(options.contentPath, value);
          } else {
            filePath = path.join(options.contentPath, page.path, value);
          }
          var fileContents = grunt.file.read(filePath);
          if (page.markdownPreprocessWithSwig) {
            fileContents = swig.compile(fileContents, { filename: filePath})({});
          }
          obj[key] = marked(fileContents);
        }
      });
    });

    next(pages);
  };
};
