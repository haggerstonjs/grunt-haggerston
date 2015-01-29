# grunt-haggerston

Haggerston is an HTML page generator designed to be used alongside other Grunt tasks to help you build static sites.

While the Haggerston website is under construction the best introduction to the ideas behind Haggerston and how to use it is available in [this blog post](http://webroo.org/articles/2013-10-27/new-website-built-with-haggerston/).

## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-haggerston --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-haggerston');
```

## The "haggerston" task

### Overview

In your project's Gruntfile, add a section named `haggerston` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  haggerston: {
    options: {
      // Task-specific options go here.
    }
  },
})
```

### Options

#### options.src
Type: `String`
Default value: `'src'`

The source directory containing the plain text files and templates that Haggerston will turn into HTML files. Relative to the `Gruntfile.js`.

#### options.dest
Type: `String`
Default value: `'out'`

The destination directory that Haggerston will export the generated HTML files into. Relative to the `Gruntfile.js`.

#### options.contentPath
Type: `String`
Default value: `options.src + 'content'`

The directory that contains the plain text files. Generally omitted in favour of the default.

#### options.templatesPath
Type: `String`
Default value: `options.src + 'templates'`

The directory that contains the Swig template files. Generally omitted in favour of the default.

#### options.swigFilters
Type: `Object`
Default value: `null`

An object map of Swig filter functions that will be available when rendering page templates. See [Swig Custom Filters](http://paularmstrong.github.io/swig/docs/#filters-custom) for more information.

#### options.swigTags
Type: `Object`
Default value: `null`

An object map of Swig tag functions that will be available when rendering page templates. See [Swig Custom Tags](http://paularmstrong.github.io/swig/docs/#tags-custom) for more information.

#### options.swigExtensions
Type: `Object`
Default value: `null`

An object map of Swig library extensions that will be available when rendering page templates. See [Swig Custom Tags](http://paularmstrong.github.io/swig/docs/#tags-custom) for more information.

### Usage Examples

#### Default Options

If the default directory paths are satisfactory then you can omit all options entirely:

```js
grunt.initConfig({
  haggerston: {},
})
```

#### Custom Options

Alternatively you can specify custom paths:

```js
grunt.initConfig({
  haggerston: {
    options: {
      contentPath: 'source',
      templatePath: 'source/templates',
      dest: 'deploy'
    }
  }
})
```

### Generating draft pages

Pages can be tagged as drafts and generated only when a specific option is passed to the grunt command.

To do this you simply add an `isDraft` flag to the page `json` file, like so:

```js
{
  "template": "article.html",
  "isDraft": true,
  "templateData": {}
}
```

The run the grunt task with the following option:

    grunt --generateDrafts=true

If this command line option is false, or ommitted, the draft pages are not generated or linked to at all.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

_(Nothing yet)_
