'use strict';

var Node = function(path) {
  this.path = path;
  this.children = [];
};

Node.prototype.initialize = function(filename, properties)
{
  this.filename = filename;
  // TODO: Defaults
  for (var prop in properties) {
    this[prop] = properties[prop];
  }
}

module.exports = Node;