/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var swig = require('swig');
var _ = require('underscore');

// The Page class represents a page of site that should be rendered to html
var Page = function(url, jsonData) {

  // Set various path and filename strings
  this.prettyUrl = this.url = url;
  this.filename = path.basename(url);
  this.path = path.dirname(url);
  this.templateData = {};

  // Pretty URLs should be directory style for index.html
  if (this.filename === 'index.html') {
    if (this.path === '') {
      this.prettyUrl = '';
    } else {
      this.prettyUrl = path.dirname(this.prettyUrl) + path.sep;
    }
  }

  // Copy over properties from the passed json data onto this object
  _(this).extend(jsonData);
};

Page.prototype.render = function(haggerston) {
  // Create an intermediate data provider that will combine the properties of templateData
  // with this page object.
  var data = _({
    page: this,
    haggerston: haggerston
  }).extend(this.templateData);

  var rendered = swig.compileFile(this.template).render(data);
  return rendered;
};

module.exports = Page;
