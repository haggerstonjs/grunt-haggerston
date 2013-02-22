/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');


module.exports = function(grunt) {

  grunt.registerTask('haggerston', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
          src: 'src',
          out: 'out'
        }),
        Node = require('./lib/node')(options.src, grunt)
        ;

    if (!grunt.file.isDir(options.src)) {
      grunt.fail.warn('src value is not a valid directory');
    }
    if (!grunt.file.isDir(options.out)) {
      grunt.fail.warn('out value is not a valid directory');
    }

    // Grab array of json file paths from the src folder
    var jsonFilePaths = grunt.file.expand(options.src + '/**/*.json');

    // Site path is the src path plus the content path,
    // this is the base from which actual page paths start.
    var sitePath = path.join(options.src, 'content') + path.sep;

    // Create a node that represents the root of the site. This will hold the hirarchy
    // of Node objects that represents the directory structure of the src folder.
    var site = new Node('');

    // Temporary and intermediate map of nodes keyed by their path,
    // used to make lazy instantiation of nodes easier.
    var nodesByPath = {};

    jsonFilePaths.forEach(function(filePath) {
      var objPath = path.dirname(filePath) // get directory of the file
                        .substr(sitePath.length) // chop off the sitePath prefix
                        .split(path.sep) // split paths segments into an array
                        .filter(function(e) {return e;}); // remove empty elements

      var basePath = '';
      var baseNode = site;

      // This builds up an object hierarchy of each directory segment in the path
      for (var i in objPath) {
        var pathSegment = objPath[i];
        basePath += pathSegment + path.sep;

        // Try and get node from the map, and if it doesn't exist then create it
        var node = nodesByPath[basePath];
        if (!node) {
          node = nodesByPath[basePath] = new Node(basePath);
          baseNode.children.push(node);
        }
        baseNode = node;
      }

      // Create the actual file node at the deepest part of the object hierarchy
      baseNode.initialize(path.basename(filePath, '.json'), grunt.file.readJSON(filePath));

    });

    console.log(JSON.stringify(site, null, 2));

  });
};
