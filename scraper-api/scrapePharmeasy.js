const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePharmeasy(searchTerm) {
  try {
    const url = `https://pharmeasy.in/search/all?name=${encodeURIComponent(searchTerm)}`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    };
    const response = await axios.get(url, { headers, timeout: 10000 });
    const $ = cheerio.load(response.data);

    // Get top 3 products
    const productCards = $('[data-testid="product-card"]').slice(0, 3);
    const results = [];

    productCards.each((i, card) => {
      const $card = $(card);
      const name = $card.find('[data-testid="product-name"]').text().trim();
      const priceText = $card.find('[data-testid="product-price"]').text().trim();
      const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
      // Correct anchor selection
      const anchor = $card.find('a[href^="/"]').first();
      const path = anchor.length ? anchor.attr('href') : null;

      if (name && !isNaN(price) && path) {
        results.push({
          source: 'PharmEasy',
          name,
          price,
          url: `https://pharmeasy.in${path}`
        });
      }
    });

    return results.length > 0 ? results : null;
  } catch (error) {
    console.error(`PharmEasy scraping error for "${searchTerm}":`, error.message);
    return null;
  }
}

module.exports = { scrapePharmeasy };
