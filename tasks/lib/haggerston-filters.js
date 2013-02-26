/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

exports.haggerstonLink = function(fromPage, toPage) {
  var relativeLink = path.relative(fromPage.path , toPage.url);
  if (toPage.filename === 'index.html') {
    relativeLink = path.dirname(relativeLink) + path.sep;
  }
  return relativeLink;
}