/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

var Node = function(path) {
  this.path = path;
  this.children = [];
};

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('haggerston', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      src: 'src',
      out: 'out'
    });

    if (!grunt.file.isDir(options.src)) {
      grunt.fail.warn('src value is not a valid directory');
    }
    if (!grunt.file.isDir(options.out)) {
      grunt.fail.warn('out value is not a valid directory');
    }

    // Grab array of json file paths from the src folder
    var jsonFilePaths = grunt.file.expand(options.src + '/**/*.json');

    // Base path is the src path plus the content path
    var rootPath = path.join(options.src, 'content') + path.sep;

    var site = new Node('');

    var nodesByPath = {};

    jsonFilePaths.forEach(function(filePath) {
      var objPath = path.dirname(filePath)
                        .substr(rootPath.length)
                        .split(path.sep)
                        .filter(function(e) {return e;}); // remove empty elements

      var basePath = '';
      var baseNode = site;

      for (var i in objPath) {
        var pathSegment = objPath[i];
        basePath += pathSegment + path.sep;
        var node = nodesByPath[basePath];

        if (!node) {
          node = nodesByPath[basePath] = new Node(basePath);
          baseNode.children.push(node);
        }
        baseNode = node;
      }

      baseNode.filename = path.basename(filePath, '.json');
      var objFileJSON = grunt.file.readJSON(filePath);
      for (var prop in objFileJSON) {
        baseNode[prop] = objFileJSON[prop];
      }
    });

    console.log(JSON.stringify(site, null, 2));

  });
};
