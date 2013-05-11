# grunt-haggerston

> A static site generator

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
      contentPath: 'sourceFiles',
      templatePath: 'htmlTemplates'
      dest: 'exported',
    }
  },
})
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

_(Nothing yet)_
