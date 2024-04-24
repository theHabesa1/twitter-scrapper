const express = require('express');
const router = express.Router();
const { startScraping, stopScraping } = require('../services/scraperService');


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

module.exports = router;
