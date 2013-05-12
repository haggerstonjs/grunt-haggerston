/*
 * grunt-haggerston
 * https://github.com/haggerstonjs/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var path = require('path');
var grunt = require('grunt');
var cheerio = require('cheerio');

module.exports = function () {
  'use strict';

  return function (pages, next, options) {
    _(pages).each(function(page) {
      // Load the rendered page string into cheerio so we can modify it
      var $ = cheerio.load(page.renderedTemplate);

      // Find each code block and run it through the highlighter
      $('link[rel=include]').each(function(i, element) {
        // Grab ref to the original link element so we can replace it later
        var $codeLink = $(element);

        // Find and load the code file
        var href = $codeLink.attr('href');
        var includePath = path.join(options.contentPath, page.path, href);
        var fileContents = grunt.file.read(includePath);

        // If a line range is supplied then truncate the contents to match
        var range = $codeLink.attr('data-lines');
        if (range) {
          range = range.split('-');
          fileContents = fileContents.split('\n').splice(range[0] - 1, range[1] - range[0]).join('\n');
        }
        
        var lang = $codeLink.attr('data-lang');

        // Create new code block and insert the file contents
        var $codeBlock = $('<pre><code></code></pre>');
        $codeBlock.find('code').addClass('lang-' + lang);
        $codeBlock.find('code').html(fileContents);

        // Replace the original link element with the new code block
        $codeLink.replaceWith($codeBlock);
      });

      // Render the page string from cheerio back into the page object
      page.renderedTemplate = $.html();
    });

    next(pages);
  };
};
