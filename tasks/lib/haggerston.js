/*
 * grunt-haggerston
 * https://github.com/haggerstonjs/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');
var _ = require('underscore');
var async = require('async');
var path = require('path');
var Page = require('./page');

var Haggerston = function(options) {
  this.options = options;
  this.middlewares = [];
  this.pages = [];

  var jsonFiles = grunt.file.expand(options.contentPath + '/**/*.json');

  // Generate a Page object corresponding to each JSON file
  _(jsonFiles).each(function(jsonFile) {
    var jsonData = grunt.file.readJSON(jsonFile);
    var pageUrl = '/' + path.relative(options.contentPath, jsonFile).replace('.json', jsonData.extension || '.html');
    grunt.verbose.writeln('Initialising Page for ' + pageUrl.cyan)
    var page = new Page(pageUrl, jsonData);
    this.pages.push(page);
  }, this);
};

Haggerston.prototype.use = function(middleware) {
  this.middlewares.push(middleware);
};

Haggerston.prototype.start = function(destPath, done) {
  var pages = this.pages;
  var options = this.options;

  // Apply middleware
  async.waterfall(
    [
      // Waterfall doesn't pass an argument into the first function
      function(cb) {
        cb(null, pages);
      }
    ].concat(_(this.middlewares).map(function(middleware, index) {
      return function(pages, cb) {
        grunt.verbose.writeln('Running middleware[' + index + '] on ' + pages.length + ' pages');
        middleware(
          pages,
          function(pages) {
            cb(null, pages);
          },
          options
        );
      };
    })),
    function(error, pages) {
      // Write pages to files
      _(pages).each(function(page) {
        var outFilePath = path.join(destPath, page.url);
        grunt.verbose.writeln('Generating ' + outFilePath.cyan);
        grunt.file.write(outFilePath, page.renderedTemplate);
      });

      // The grunt async task callback passed from the haggerston-task
      done();
    }
  );
};

module.exports = Haggerston;
