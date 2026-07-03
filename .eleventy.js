module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("projects", function(api) {
  return api
    .getFilteredByTag("projects")
    .sort((a, b) => (a.data.featuredOrder || 999) - (b.data.featuredOrder || 999));
});



return {
  dir: {
    input: "src",
    includes: "_includes",
    output: "_site"
  }
};

};

