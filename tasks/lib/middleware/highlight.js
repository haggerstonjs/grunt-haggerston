/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var hljs = require('highlight.js');
var cheerio = require('cheerio');

module.exports = function () {
  'use strict';

  return function (pages, next, options) {
    _(pages).each(function(page) {
      // Load the rendered page string into cheerio so we can modify it
      var $ = cheerio.load(page.renderedTemplate);

      // Find each code block and run it through the highlighter
      $('code').each(function(i, element) {
        // Grab a ref to the code block so we can replace it's contents later
        var $code = $(element);
        var codeString = $code.html();
        var lang = $(element).attr('class');
        var highlightedCode;
        if (lang) {
          lang = lang.match(/lang-(.*)/)[1];
          highlightedCode = hljs.highlight(lang, codeString).value;
        } else {
          highlightedCode = hljs.highlightAuto(codeString).value;
        }
        // Replace the code block html with the highlighted string
        $code.html(highlightedCode);
      });

      // Render the page string from cheerio back into the page object
      page.renderedTemplate = $.html();
    });

    next(pages);
  };
};
