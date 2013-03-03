/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var _ = require('underscore');

// The Page class represents a page of site that should be rendered to html
var Page = function(url, jsonData) {

  // Set various url, path and filename properties
  this.url = url;
  this.path = path.dirname(url);
  this.filename = path.basename(url);

  // Pretty URLs should be directory style only for index.html
  if (this.filename === 'index.html') {
    this.prettyUrl = path.join(this.path, path.sep);
  } else {
    this.prettyUrl = this.url;
  }

  // Copy over properties from the passed json data onto this object
  _(this).defaults(jsonData);

  this.templateData = this.templateData || {};
};

module.exports = Page;
