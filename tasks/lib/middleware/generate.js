/*
 * grunt-haggerston
 * https://github.com/haggerstonjs/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var path = require('path');
var Page = require('../page');

module.exports = function() {
  'use strict';

  function getCategorisedPages(pages, category) {
    var pagesByCategory = {};
    _(pages).each(function(page) {
      if (page.templateData[category]) {
        _(page.templateData[category]).each(function(cat) {
          var pagesForCategory = pagesByCategory[cat];
          if (!pagesForCategory) {
            pagesForCategory = pagesByCategory[cat] = [];
          }
          pagesForCategory.push(page);
        });
      }
    });
    return pagesByCategory;
  }
  
  return function (pages, next, options) {

    var generatedPages = [];
    _(pages).each(function(page, i) {
      if (page.generate) {
        _(getCategorisedPages(pages, page.generate.category)).each(function(subpages, category) {
          var categoryPageUrl = path.join(page.path, category.replace(' ', '-') + (page.extension || '.html'));
          var categoryPage = new Page(categoryPageUrl, _({}).extend(page, {
              templateData: _.extend({}, page.templateData, {
                category: category,
                subpages: subpages
              })
            })
          );
          generatedPages.push(categoryPage);
        });
      } else {
        generatedPages.push(page);
      }
    });
    next(generatedPages);
  };
};