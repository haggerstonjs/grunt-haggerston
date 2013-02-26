/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var Page = require('./page');

var Haggerston = function(contentPath, jsonFiles) {

  Page.contentPath = contentPath;

  // Create array of Page objects that need to be rendered to html files
  var pages = this.pages = [];

  var pagesByPath = this.pagesByPath = {};

  var haggerston = this;

  // Create pages
  jsonFiles.forEach(function(jsonFile) {
    var page = new Page(haggerston, jsonFile);
    pages.push(page);
    pagesByPath[page.path] = page;
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

module.exports = Haggerston;