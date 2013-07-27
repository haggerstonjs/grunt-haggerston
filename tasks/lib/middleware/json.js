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

module.exports = function() {
  'use strict';

  return function json(pages, next, options) {
    _(pages).each(function(page) {
      // Recursively loop over every property of the page's templateData
      _(page.templateData).deepEach(function(value, key, obj) {
        // Search for string values ending in '.json'
        if (_.isString(value) && value.match(/\.json$/)) {
          // Absolute urls are based off the contentPath, not the OS file system
          var filePath;
          if (grunt.file.isPathAbsolute(value)) {
            filePath = path.join(options.contentPath, value);
          } else {
            filePath = path.join(options.contentPath, page.path, value);
          }
          obj[key] = grunt.file.readJSON(filePath);
        }
      });
    });
    
    next(pages);
  };
};
