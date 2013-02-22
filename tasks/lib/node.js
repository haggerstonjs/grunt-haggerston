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
    for (var prop in properties) {
      this[prop] = properties[prop];
    }

    // TODO: Defaults
    // TODO: Create this.templateData.htmlTitle based on the title?

    for (var fieldName in this.templateData) {
      var data = this.templateData[fieldName];
      if (data.match(/\.md$/)) {
        this.templateData[fieldName] = marked(
            grunt.file.read(basePath + '/content/' + this.path + data),
            {
//            highlight: function(code, lang)
//            {
//              return hljs.highlight(lang, code).value;
//            }
            }
        )
      }
    }
  }

  Node.prototype.render = function()
  {

    var rendered = swig.compileFile(this.template).render(this.templateData);
    return rendered();
  }

  return Node;
};


