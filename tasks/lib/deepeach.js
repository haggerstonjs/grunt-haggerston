/*
 * grunt-haggerston
 * https://github.com/vitch/grunt-haggerston
 *
 * Copyright (c) 2013 Kelvin Luck, Matt Sweetman
 * Licensed under the MIT license.
 */

var _ = require('underscore');

// Depth-first recursive iterator for object properties.
// Will iterate over both complex objects and arrays.
var deepEach = function(obj, iterator, context) {
  _.each(obj, function(value, key, obj) {
    iterator.call(context, value, key, obj);
    // Functions have a length, defined by the number of arguments,
    // but we don't want to iterate over them.
    if (_.isObject(value) && !_.isFunction(value)) {
      deepEach(value, iterator, context);
    }
  });
}

// Add to underscore for convenience
_.mixin({
  deepEach: deepEach,
  deepForEach: deepEach
});

module.exports = deepEach;
