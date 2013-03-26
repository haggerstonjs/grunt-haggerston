/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var path = require('path');
var grunt = require('grunt');
var async = require('async');
var jsdom = require('jsdom');
var hljs = require('highlight.js');

module.exports = function () {
  'use strict';

  return function (pages, next, options) {
    async.each(pages, function (page, cb) {
      jsdom.env(page.renderedTemplate, function (errors, window) {
        var includeBlocks = window.document.querySelectorAll('link[rel=include]');
        if (includeBlocks.length) {
          _(includeBlocks).each(function (includeNode) {
            var originalCode = includeNode.outerHTML;
            var href = includeNode.getAttribute('href');
            var fileToInclude = path.join(options.contentPath, page.path, href);
            var fileContents = grunt.file.read(fileToInclude);
            var range = includeNode.getAttribute('data-lines');
            if (range) {
              range = range.split('-');
              fileContents = fileContents.split('\n').splice(range[0] - 1, range[1] - range[0]).join('\n');
            }
            var includedLanguage = includeNode.getAttribute('data-lang');
            if (includedLanguage) {
              fileContents = '<pre><code class="lang-' + includedLanguage + '">' + fileContents + '</code></pre>';
            }
            page.renderedTemplate = page.renderedTemplate.replace(originalCode, fileContents);
          });
        }
        window.close();
        cb(null);
      });
    }, function() {
      next(pages);
    });
  };
};
