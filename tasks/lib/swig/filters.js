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

// Sorts passed items by key.
// key can be a path to the key in dot notation (e.g. 'templateData.date')
exports.sort = function(pages, key) {
  if (key.indexOf('.') === -1) {
    return _(pages).sortBy(key);
  }
  var keyParts = key.split('.');
  return _(pages).sortBy(function(page) {
    var val = page;
    _(keyParts).each(function(part) {
      val = val[part];
    });
    return val;
  });
};

exports.lastModified = function(page) {
//  var stat = require('fs').statSync(page.jsonFile);
//  return stat.mtime;
  return '2013-02-01';
};
