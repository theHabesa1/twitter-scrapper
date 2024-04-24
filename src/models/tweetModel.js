// tweetModel.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'tweets',
  password: '',
  port: 5432,
});


async function saveTweet(tweet) {
  const client = await pool.connect();
  try {
    const queryText = 'INSERT INTO tweets(text, images, video, timestamp) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [tweet.text, JSON.stringify(tweet.images), tweet.video, new Date(parseInt(tweet.timestamp))];
    const result = await client.query(queryText, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}


async function getTweets(page, pageSize) {
  const client = await pool.connect();
  try {
    const offset = (page - 1) * pageSize;
    const queryText = 'SELECT * FROM tweets ORDER BY timestamp DESC LIMIT $1 OFFSET $2';
    const values = [pageSize, offset];
    const result = await client.query(queryText, values);
    return result.rows;
  } finally {
    client.release();
  }
}

module.exports = {
  saveTweet,
  getTweets,
};
