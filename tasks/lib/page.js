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
var marked = require('marked');
var swig = require('swig');
var _ = require('underscore');

// The Page class represents a page of site that should be rendered to html
var Page = function(haggerston, jsonFile) {

  var self = this;

  var jsonData = grunt.file.readJSON(jsonFile);

  // Set various path and filename strings
  this.haggerston = haggerston;
  this.jsonFile = jsonFile;
  this.jsonPath = path.dirname(jsonFile);
  this.filename = path.basename(jsonFile, '.json') + (jsonData.extension || '.html');
  this.path = this.urlPath = path.relative(Page.contentPath, this.jsonPath);
  this.url = path.join(this.urlPath, this.filename);
  this.children = [];

  // Copy over properties from the passed json data onto this object
  _(this).extend(jsonData);

  // A page must have template data to render if it wasn't already specified in the .json
  this.templateData = this.templateData || {};

  // Recursively find fields in templateData that specify markdown files and parse them
  function findAndParseMarkdown(data) {
    for (var key in data) {
      var value = data[key];
      if (typeof value === 'string') {
        // If it's a string then check if the extension is .md and parse it
        if (value.match(/\.md$/)) {
          var mdPath = path.join(self.jsonPath, value);
          data[key] = marked(grunt.file.read(mdPath));
        }
      } else if (typeof value === 'object') {
        findAndParseMarkdown(value); // Recursively search nested objects
      }
    }
  }

  findAndParseMarkdown(this.templateData);
};

Page.prototype.render = function(haggerston) {
  // Create an intermediate data provider that will combine the properties of templateData
  // with this page object.
  var data = _({}).extend(this.templateData);
  data.page = this;
  data.haggerston = haggerston;

  var rendered = swig.compileFile(this.template).render(data);
  return rendered;
};

module.exports = Page;
