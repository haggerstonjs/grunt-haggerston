/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var path = require('path');
var grunt = require('grunt');
var marked = require('marked');
var hljs = require('highlight.js');

module.exports = function() {
  'use strict';

  marked.setOptions({
    highlight: function(code, lang) {
      var parsed;
      if (lang) {
        parsed = hljs.highlight(lang, code).value;
      } else {
        parsed = hljs.highlightAuto(code).value;
      }
      return parsed;
    }
  });

  return function (pages, next, options) {
    _(pages).each(function(page) {
      // Recursively loop over every property of the page
      _(page).deepEach(function(value, key, obj) {
        // Search for string values ending in '.json'
        if (_.isString(value) && value.match(/\.md$/)) {
          // Absolute urls are based off the contentPath, not the OS file system
          var filePath;
          if (grunt.file.isPathAbsolute(value)) {
            filePath = path.join(options.contentPath, value);
          } else {
            filePath = path.join(options.contentPath, page.path, value);
          }
          obj[key] = marked(grunt.file.read(filePath));
        }
      });
    });

    next(pages);
  };
};
