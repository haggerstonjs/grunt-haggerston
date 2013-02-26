/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var _ = require('underscore');

exports.linkTo = function(fromPage, toPage) {
  var relativeLink = path.relative(fromPage.path , toPage.url);
  if (toPage.filename === 'index.html') {
    relativeLink = path.dirname(relativeLink) + path.sep;
  }
  return relativeLink;
};

exports.findPage = function(page, url) {
  url = url || page.url;
  return page.haggerston.findPage(url);
};

exports.getChildren = function(page, url) {
  url = url || page.url;
  return page.haggerston.findPage(url).children;
};

exports.findInPath = function(page, searchPath) {
  searchPath = searchPath || './';
  if (searchPath.indexOf('./') === 0) {
    searchPath = path.join(page.path, searchPath.substr(2));
  }
  return page.haggerston.find(searchPath);
};

exports.basePath = function(page) {
  return path.relative(page.path , '') + path.sep;
};

exports.sort = function(pages, key) {
  return _(pages).sortBy(key);
};

exports.where = function(pages, props) {
  return _(pages).where(props);
};
