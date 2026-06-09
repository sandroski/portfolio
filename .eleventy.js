module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("projects", function(api) {
    return api.getFilteredByTag("projects");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }, pathPrefix: "/portfolio/"
  };

};

