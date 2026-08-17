module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("projects", function(api) {
  return api
    .getFilteredByTag("projects")
    .sort((a, b) => {
      const orderA = a.data.projectNumber;
      const orderB = b.data.projectNumber;

      // 1. If both items have an explicit number, sort by that number
      if (orderA !== undefined && orderB !== undefined) {
        return orderA - orderB;
      }
      
      // 2. If only one item has a number, prioritize the numbered item
      if (orderA !== undefined) return -1;
      if (orderB !== undefined) return 1;

      // 3. If neither has a number, fall back to chronological order (oldest first)
      return a.date - b.date;
    });
  });



return {
  dir: {
    input: "src",
    includes: "_includes",
    output: "_site"
  }
};

};


