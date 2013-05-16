/*
 * grunt-haggerston
 * https://github.com/haggerstonjs/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
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

exports.relativePath = function(fromPage, toPage) {
  var relativeLink = path.relative(fromPage.path , toPage.url);
  return path.dirname(relativeLink) + path.sep;
};

exports.basePath = function(page) {
  return path.relative(page.path , '/') + path.sep;
};

exports.where = function(pages, propertyName, value) {
  return _(pages).filter(function(page) {
    return page[propertyName] === value;
  });
};

exports.reject = function(pages, propertyName, value) {
  return _(pages).reject(function(page) {
    return page[propertyName] === value;
  });
};

exports.matches = function(pages, propertyName, value) {
  return _(pages).filter(function(page) {
    var reg = new RegExp(value);
    if (!page[propertyName].match(reg)) {
      return false;
    }
    return true;
  });
};

exports.sort = function(pages, key, descending) {
  var sorted = _(pages).sortBy(key);
  if (descending) {
    sorted.reverse();
  }
  return sorted;
};

exports.lastModified = function(page) {
//  var stat = require('fs').statSync(page.jsonFile);
//  return stat.mtime;
  return '2013-02-01';
};
