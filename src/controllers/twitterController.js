const express = require('express');
const router = express.Router();
const { startScraping, stopScraping } = require('../services/scraperService');
const { getTweetsWithPagination } = require('../models/tweetModel');

router.get('/start', (req, res) => {
  try {
    const interval = req.query.interval || 3600000; 
    startScraping(interval);
    res.json({ message: `Scraping started. Data will be fetched every ${interval / 60000} minutes.` });
  } catch (error) {
    console.error('Error starting scraping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/stop', (req, res) => {
  try {
    stopScraping();
    res.json({ message: 'Scraping stopped.' });
  } catch (error) {
    console.error('Error stopping scraping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tweets', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10; // Default page size is 10
      const tweets = await getTweetsWithPagination(page, pageSize);
      res.json(tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
