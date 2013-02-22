'use strict';

var marked = require('marked'),
    swig = require('swig'),
    Node = function(path) {
      this.path = path;
      this.children = [];
    };

module.exports = function(basePath, grunt)
{
  swig.init({
    root: basePath + '/templates'
  });

  Node.prototype.initialize = function(filename, properties)
  {
    this.filename = filename;

    // Copy over properties from the json data onto the base of this object
    for (var prop in properties) {
      this[prop] = properties[prop];
    }

    // A node must have template data to render with if it wasn't already specified in the .json
    this.templateData = this.templateData || {};
  };

  Node.prototype.render = function()
  {
    var path = this.path;

    // Recursively finds fields in the templateData object that specify markdown files
    // and parses them to html.
    function findAndParseMarkdown(data) {
      for (var fieldName in data) {
        var fieldValue = data[fieldName];
        if (typeof fieldValue === 'string') {
          // If it's a string then check if the extension is .md and parse it
          if (fieldValue.match(/\.md$/)) {
            var mdPath = basePath + '/content/' + path + fieldValue;
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
    // with this node object.
    var templateDataProvider = {};
    for (var prop in this.templateData) {
      templateDataProvider[prop] = this.templateData[prop];
    }
    templateDataProvider.node = this;

    var rendered = swig.compileFile(this.template).render(templateDataProvider);
    return rendered;
  };

  return Node;
};


