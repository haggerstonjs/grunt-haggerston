/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var swig = require('swig');

module.exports = function() {
  'use strict';

  return function (pages, next, options) {
    _(pages).each(function(page) {
      // Create an intermediate data provider that will combine templateData and the page object
      var data = _.extend({
          page: page,
          pages: pages
        },
        page.templateData
      );
      page.renderedTemplate = swig.compileFile(page.template).render(data);
    });

    next(pages);
  };
};
