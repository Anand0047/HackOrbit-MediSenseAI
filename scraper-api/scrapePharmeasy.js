const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function scrapePharmeasy(searchTerm) {
  try {
    const url = `https://pharmeasy.in/search/all?name=${encodeURIComponent(searchTerm)}`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);

    const productCard = $('div[class*="ProductCard_"]').first();
    if (!productCard.length) return null;

    const name = productCard.find('h1[class*="ProductCard_"]').text().trim();
    const priceText = productCard.find('div[class*="ProductCard_priceGroup"]').text().trim();
    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
    const path = productCard.find('a').attr('href');

    if (name && !isNaN(price)) {
      return {
        source: 'PharmEasy',
        name,
        price,
        url: path.startsWith('http') ? path : `https://pharmeasy.in${path}`
      };
    }
    return null;
  } catch (error) {
    console.error(`PharmEasy error for "${searchTerm}":`, error.message);
    return null;
  }
};