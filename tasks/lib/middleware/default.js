/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

module.exports = [
  require('./json')(),
  require('./markdown')(),
  require('./generate')(),
  require('./render')(),
  require('./include')(),
  require('./highlight')()
];