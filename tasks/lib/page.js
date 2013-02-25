/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    grunt = require('grunt'),
    marked = require('marked'),
    swig = require('swig');

// The Page class represents a page of site that should be rendered to html
var Page = function(baseContentPath, file, properties) {
  this.baseContentPath = baseContentPath;
  this.file = file; // full path and filename
  this.filename = path.basename(file); // just the filename
  this.directory = path.dirname(file); // just the direcrory path
  this.children = [];

  console.log(this.file, this.filename, this.directory);

   // Copy over properties from the passed json data onto this object
  for (var prop in properties) {
    this[prop] = properties[prop];
  }

  // A page must have template data to render it wasn't already specified in the .json
  this.templateData = this.templateData || {};
};

Page.prototype.render = function() {
  var baseContentPath = this.baseContentPath;
  var directory = this.directory;

  // Recursively finds fields in the templateData object that specify markdown files
  // and parses them to html.
  function findAndParseMarkdown(data) {
    for (var fieldName in data) {
      var fieldValue = data[fieldName];
      if (typeof fieldValue === 'string') {
        // If it's a string then check if the extension is .md and parse it
        if (fieldValue.match(/\.md$/)) {
          var mdPath = path.normalize(path.join(baseContentPath, directory, fieldValue));
          data[fieldName] = marked(grunt.file.read(mdPath));
        }
      } else if (typeof fieldValue === 'object') {
        // Recursively search nested objects
        findAndParseMarkdown(fieldValue);
      }
    }
  }

  findAndParseMarkdown(this.templateData);

  // Create an intermediate data provider that will combine the properties of templateData
  // with this page object.
  var templateDataProvider = {};
  for (var prop in this.templateData) {
    templateDataProvider[prop] = this.templateData[prop];
  }
  templateDataProvider.page = this;

  var rendered = swig.compileFile(this.template).render(templateDataProvider);
  return rendered;
};

module.exports = Page;
