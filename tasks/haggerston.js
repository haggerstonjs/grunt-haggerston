/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    swig = require('swig');

var Page = require('./lib/page');

module.exports = function(grunt) {
  grunt.registerTask('haggerston', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
          src: 'src',
          out: 'out'
        });

    if (!grunt.file.isDir(options.src)) {
      grunt.fail.warn('options.src is not a valid directory');
    }

    var contentPath = path.join(options.src, 'content');
    var templatesPath = path.join(options.src, 'templates');

    Page.contentPath = contentPath;

    // Set base path that swig will look inside for template files
    swig.init({
      root: templatesPath
    });

    // Grab array of json file paths from the src folder
    var jsonFiles = grunt.file.expand(options.src + '/**/*.json');

    // Create array of Page objects that need to be rendered to html files
    var pages = [];
    jsonFiles.forEach(function(jsonFile) {
      var page = new Page(jsonFile);
      pages.push(page);
    });

    // Render each file page to a file
    pages.forEach(function(page) {
      // console.log(page);
      var outFilePath = path.join(options.out, page.url);
      grunt.log.writeln('Generating ' + page.jsonFile.cyan + ' -> ' + outFilePath.cyan);
      grunt.file.write(outFilePath, page.render());
    });

  });
};
