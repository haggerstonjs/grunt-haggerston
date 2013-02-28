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

module.exports = function() {
  'use strict';

  var pagePath;

  function findAndParseJson(data) {
    for (var key in data) {
      var value = data[key];
      if (typeof value === 'string') {
        // If it's a string then check if the extension is .md and parse it
        if (value.match(/\.json$/)) {
          var jsonPath = path.join(pagePath, value);
          data[key] = grunt.file.readJSON(jsonPath);
        }
      } else if (typeof value === 'object') {
        // Recursively search nested objects
        findAndParseJson(value);
      }
    }
  }

  return function (pages, next, options) {
    _(pages).each(function(page) {
      pagePath = path.join(options.contentPath, page.path);
      findAndParseJson(page);
    });
    next(pages);
  };
};
