/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var async = require('async');
var jsdom = require('jsdom');
var hljs = require('highlight.js');

module.exports = function () {
  'use strict';

  return function (pages, next, options) {
    async.each(pages, function (page, cb) {
      jsdom.env(page.renderedTemplate, function (errors, window) {
        var codeBlocks = window.document.querySelectorAll('code');
        if (codeBlocks.length) {
          _(codeBlocks).each(function (codeNode) {
            var cssClass = codeNode.getAttribute('class');
            var cssLanguage = cssClass.match(/lang-(.*)/);
            var highlightedCode;
            if (cssLanguage && cssLanguage.length) {
              highlightedCode = hljs.highlight(cssLanguage[1], codeNode.innerHTML).value;
            } else {
              highlightedCode = hljs.highlightAuto(codeNode.innerHTML).value;
            }
            codeNode.innerHTML = highlightedCode;
          });
          page.renderedTemplate = window.document.doctype.toString() + window.document.outerHTML;
        }
        window.close();
        cb(null);
      });
    }, function() {
      next(pages);
    });
  };
};
