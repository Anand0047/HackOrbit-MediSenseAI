const express = require('express');
const cors = require('cors');
const { compareMedicinePrices } = require('./scraper');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { medicines } = req.body;
  console.log('Scraping for:', medicines);

  try {
    const results = await Promise.all(
      medicines.map(async (med) => {
        const products = await compareMedicinePrices(med);
        return {
          query: med,
          results: products
        };
      })
    );
    res.json(results);
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));