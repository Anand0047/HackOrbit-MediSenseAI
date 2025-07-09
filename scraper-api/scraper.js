const { scrape1mg } = require('./scrape1mg');
const { scrapePharmeasy } = require('./scrapePharmeasy');

async function compareMedicinePrices(searchTerm) {
  try {
    console.log(`Searching for: ${searchTerm}`);
    
    const [results1mg, resultsPharmeasy] = await Promise.all([
      scrape1mg(searchTerm),
      scrapePharmeasy(searchTerm)
    ]);

    const combinedResults = [
      ...(Array.isArray(results1mg) ? results1mg : []),
      ...(Array.isArray(resultsPharmeasy) ? resultsPharmeasy : [])
    ];

    console.log(`Results for ${searchTerm}:`, combinedResults);
    return combinedResults;
  } catch (error) {
    console.error(`Error comparing prices for ${searchTerm}:`, error);
    return [];
  }
}

module.exports = { compareMedicinePrices };
