const axios = require('axios');
const cheerio = require('cheerio');

async function scrape1mg(searchTerm) {
  try {
    console.log(`Scraping 1mg for: ${searchTerm}`);
    const url = `https://www.1mg.com/search/all?filter=true&name=${encodeURIComponent(searchTerm)}`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);

    // Try multiple selectors
    let productCard = $('.style__container___cTDz0, [data-testid="product-card"]').first();
    
    if (!productCard.length) {
      console.log('No product card found on 1mg');
      return null;
    }

    const name = productCard.find('.style__pro-title___3zxNC, [itemprop="name"]').text().trim();
    const price = productCard.find('.style__price-tag___B2csA, [data-testid="price"]').text().trim().replace(/[^\d.]/g, '');
    const path = productCard.find('a').first().attr('href');

    if (name && price && path) {
      return {
        source: '1mg',
        name,
        price: parseFloat(price),
        url: path.startsWith('http') ? path : `https://www.1mg.com${path}`
      };
    }
    return null;
  } catch (error) {
    console.error(`1mg scraping error for "${searchTerm}":`, error.message);
    return null;
  }
}

module.exports = { scrape1mg };