/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

exports.linkTo = function(fromPage, toPage) {
  var relativeLink = path.relative(fromPage.path , toPage.url);
  if (toPage.filename === 'index.html') {
    relativeLink = path.dirname(relativeLink) + path.sep;
  }
  return relativeLink;
};

exports.findInPath = function(page, searchPath) {
  if (searchPath) {
    if (searchPath.indexOf('./') === 0) {
      searchPath = path.join(page.path, searchPath.substr(2));
    }
    return page.haggerston.find(searchPath);
  }
  return page.children;
};

exports.basePath = function(page)
{
  return path.relative(page.path , '') + path.sep;
};