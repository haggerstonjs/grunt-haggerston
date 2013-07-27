/*
 * grunt-haggerston
 * https://github.com/haggerstonjs/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var swig = require('swig');

module.exports = function() {
  'use strict';

  return function render(pages, next, options) {
    _(pages).each(function(page) {
      // Create an intermediate data provider that will combine templateData and the page object
      var data = _.extend({
          page: page,
          pages: pages,
          options: options
        },
        page.templateData
      );

      page.renderedTemplate = swig.compileFile(page.template).render(data);
    });

    next(pages);
  };
};
