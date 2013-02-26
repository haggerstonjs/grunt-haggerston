'use strict';

var grunt = require('grunt');
var Haggerston = require('../tasks/lib/haggerston');
var _ = require('underscore');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.haggerston = {
  setUp: function(done) {
    // setup here if necessary

    done();
  },
  generatedHtml: function(test) {

    var expectedHtml = grunt.file.expand('test/expected/**/*.*');
    test.expect(expectedHtml.length);

    expectedHtml.forEach(
        function(path)
        {
          var generatedPath = 'tmp' + path.substr('test/expected'.length),
              actual,
              expected;
          if (grunt.file.exists(generatedPath)) {
            actual = grunt.file.read(generatedPath);
            expected = grunt.file.read(path);
            test.equal(actual, expected, 'The generated file at ' + path + ' should be as expected');
          } else {
            test.ok(false, generatedPath + ' was not generated');
          }
        }
    );

    test.done();
  },
  findPage: function(test)
  {
    test.expect(3);

    var haggerston = new Haggerston('test/fixtures/content');

    var allPages = haggerston.find('');
    test.equal(
        allPages.length,
        grunt.file.expand('test/fixtures/content/**/*.json').length,
        'The number of pages should under the root should equal the number of JSON files supplied'
    );

    var blogPages = haggerston.find('blog/');
    test.equal(
        blogPages.length,
        2,
        'There should be two pages under blog'
    );

    var blogListPage = haggerston.findPage('blog/index.html');
    test.equal(
        _(blogPages).pluck('url').join(','),
        _(blogListPage.children).pluck('url').join(','),
        'The blog pages should be all the children of the blogListPage'
    );
    test.done();
  }
};
