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

  var contentPath;
  var pagePath;

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

  function findAndParseMarkdown(page) {
    for (var key in page) {
      var value = page[key];
      if (typeof value === 'string') {
        // If it's a string then check if the extension is .md and parse it
        if (value.match(/\.md$/)) {
          // Absolute urls are based off the contentPath, not the file system
          var filePath;
          if (grunt.file.isPathAbsolute(value)) {
            filePath = path.join(contentPath, value);
          } else {
            filePath = path.join(contentPath, pagePath, value);
          }
          page[key] = marked(grunt.file.read(filePath));
        }
      } else if (typeof value === 'object') {
        // Recursively search nested objects
        findAndParseMarkdown(value);
      }
    }
  }

  return function (pages, next, options) {
    contentPath = options.contentPath;
    _(pages).each(function(page) {
      pagePath = page.path;
      findAndParseMarkdown(page);
    });
    next(pages);
  };
};
