/*
 * grunt-haggerston
 * https://github.com/haggerstonjs/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

module.exports = [
  require('./markdown')(),
  require('./generate')(),
  require('./render')(),
  require('./include')(),
  require('./highlight')()
];