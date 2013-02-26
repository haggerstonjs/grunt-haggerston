/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var grunt = require('grunt');
var _ = require('underscore');
var Page = require('./page');

var Haggerston = function(contentPath, generateFunctions) {

  Page.contentPath = contentPath;

  // Grab array of json file paths from the contentPath
  var jsonFiles = grunt.file.expand(contentPath + '/**/*.json');

  // Create array of Page objects that need to be rendered to html files
  var pages = this.pages = [];

  var pagesByPath = this.pagesByPath = {};

  var generatePages = [];

  var haggerston = this;

  // Create pages
  jsonFiles.forEach(function(jsonFile) {
    var jsonData = grunt.file.readJSON(jsonFile);

    if (jsonData.generateFunction) {
      generatePages.push({
        file: jsonFile,
        data: jsonData
      });
    } else {
      var page = new Page(haggerston, jsonFile, jsonData);
      pages.push(page);
      pagesByPath[page.path] = page;
    }
  });

  // Create generated pages
  generatePages.forEach(function(generatePageData) {
    var generatedPagesData = generateFunctions[generatePageData.data.generateFunction](haggerston, generatePageData.file, generatePageData.data.generateFunctionData);
    generatedPagesData.forEach(function(pageData) {
      var page = new Page(haggerston, pageData.file, pageData.data);
      pages.push(page);
      pagesByPath[page.path] = page;
    });
  });

  // Generate page hierarchy
  this.pages.forEach(function(page) {
    var pathParts = page.path.split(path.sep);
    var parentPage;

    while (pathParts.length) {
      pathParts.pop();
      if (parentPage = pagesByPath[pathParts.join(path.sep)]) {
        if (parentPage !== page) {
          parentPage.children.push(page);
        }
        break;
      }
    }
  });

};

Haggerston.prototype.find = function(searchPath) {
  return this.pages.filter(
      function(page)
      {
        return page.path.indexOf(searchPath) === 0;
      }
  );
};

Haggerston.prototype.findPage = function(url) {
  return _(this.pages).find(
      function(page)
      {
        return page.url === url;
      }
  );
};

module.exports = Haggerston;
