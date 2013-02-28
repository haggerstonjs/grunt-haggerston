/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');
var _ = require('underscore');
var async = require('async');
var path = require('path');
var swig = require('swig');
var Page = require('./page');

var Haggerston = function(srcPath) {
  this.middlewares = [];
  this.pages = [];
  this.srcPath = srcPath;

  var jsonFiles = grunt.file.expand(srcPath + '/**/*.json');

  // Generate a Page object corresponding to each JSON file
  _(jsonFiles).each(function(jsonFile) {
    var jsonData = grunt.file.readJSON(jsonFile);
    var pageUrl = path.relative(srcPath, jsonFile).replace('.json', jsonData.extension || '.html');
    var page = new Page(pageUrl, jsonData);
    this.pages.push(page);
  }, this);
};

Haggerston.prototype.use = function(middleware) {
  this.middlewares.push(middleware);
};

Haggerston.prototype.render = function(destPath) {
  var pages = this.pages;
  var haggerston = this;
  // Apply middleware
  async.series(
    _(this.middlewares).map(function(middleware) {
      return function(cb) {
        middleware(pages, cb, haggerston);
      };
    }),
    function(error, res) {
      // render
      _(pages).each(function(page) {
        var outFilePath = path.join(destPath, page.url);
        grunt.verbose.writeln('Generating ' + outFilePath.cyan);

        // Create an intermediate data provider that will combine the properties of the pages templateData.
        var data = _({
          page: page,
          pages: pages
        }).extend(page.templateData);

        var rendered = swig.compileFile(page.template).render(data);

        grunt.file.write(outFilePath, rendered);
      });
    }
  );
};



module.exports = Haggerston;
