const scrape1mg = require("./scrape1mg");
const scrapePharmeasy = require("./scrapePharmeasy");

module.exports = {
  async compareMedicinePrices(searchTerm) {
    try {
      const [result1mg, resultPharmeasy] = await Promise.all([
        scrape1mg(searchTerm),
        scrapePharmeasy(searchTerm)
      ]);

      const results = [];
      if (result1mg) results.push(result1mg);
      if (resultPharmeasy) results.push(resultPharmeasy);

      console.log(`Results for "${searchTerm}":`, results);
      return results;
    } catch (error) {
      console.error(`Error comparing prices for "${searchTerm}":`, error);
      return [];
    }
  }
};