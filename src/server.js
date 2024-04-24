const express = require('express');
const twitterController = require('./src/controllers/twitterController');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use('/twitter', twitterController);


app.get('/', (req, res) => {
  res.send('Welcome to the Twitter Scraper API!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
