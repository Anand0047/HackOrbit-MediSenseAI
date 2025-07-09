const { scrape1mg } = require('./scrape1mg');
const { scrapePharmeasy } = require('./scrapePharmeasy');

async function compareMedicinePrices(searchTerm) {
  try {
    console.log(`Searching for: ${searchTerm}`);
    
    // Call both scrapers in parallel
    const [results1mg, resultsPharmeasy] = await Promise.all([
      scrape1mg(searchTerm),
      scrapePharmeasy(searchTerm)
    ]);

    // Combine results from both sources
    const combinedResults = [];
    if (results1mg) combinedResults.push(...results1mg);
    if (resultsPharmeasy) combinedResults.push(...resultsPharmeasy);
    
    console.log(`Results for ${searchTerm}:`, combinedResults);
    return combinedResults;
  } catch (error) {
    console.error(`Error comparing prices for ${searchTerm}:`, error);
    return [];
  }
}

module.exports = { compareMedicinePrices };