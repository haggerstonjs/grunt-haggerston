
var _ = require('underscore');
var path = require('path');

exports.generateTagPages = function(haggerston, jsonFile, data)
{
  var jsonPath = path.dirname(jsonFile);
  var postsByTag = {};
  var pagesWithTags = haggerston.filter(function(page) {
    return page.templateData.tags !== void 0;
  });
  pagesWithTags.forEach(function(page) {
    page.templateData.tags.forEach(function(tag) {
      var pages = postsByTag[tag];
      if (!pages) {
        pages = postsByTag[tag] = [];
      }
      pages.push(page);
    });
  });
  return _(postsByTag).map(function(pages, tag) {
    return {
      file: jsonPath + path.sep + tag + '.json',
      data: _.extend(
        {
          templateData: {
            tag: tag
          },
          childPages: pages
        },
        data
      )
    };
  });
};