const puppeteer = require('puppeteer');
const { saveTweet } = require('../models/tweetModel');
const nodemailer = require('nodemailer');


let scrapeInterval;


function startScraping(interval) {
  scrapeInterval = setInterval(async () => {
    try {
      const twitterData = await scrapeTwitter();
      for (const tweet of twitterData) {
        await saveTweet(tweet);
      }
      console.log('Data saved to database successfully.');
    } catch (error) {
      console.error('Error scraping and saving to database:', error);
    }
  }, interval);
}


function stopScraping() {
  clearInterval(scrapeInterval);
}

// Function to scrape Twitter data
async function scrapeTwitter() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://twitter.com/coindesk');

  const tweets = await page.evaluate(() => {
    const posts = document.querySelectorAll('.tweet');

    const data = [];

    posts.forEach(post => {
      const text = post.querySelector('.tweet-text').innerText;
      const images = Array.from(post.querySelectorAll('.AdaptiveMedia img')).map(img => img.src);
      const video = post.querySelector('.PlayableMedia-player') ? true : false;
      const timestamp = post.querySelector('.tweet-timestamp ._timestamp').getAttribute('data-time-ms');

      data.push({
        text,
        images,
        video,
        timestamp
      });
    });

    if (video) {
        sendEmailNotification({
          text,
          images,
          video,
          timestamp
        });
      }
    

    return data;
  });

  await browser.close();

  return tweets;
}

async function sendEmailNotification(tweet) {
    // Set up Nodemailer transporter using your email credentials
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
      }
    });
  
    // Email content
    let mailOptions = {
      from: 'your_email@gmail.com',
      to: 'recipient_email@example.com',
      subject: 'New Tweet with Video',
      text: `New tweet with video: ${tweet.text}`,
      html: `<p>New tweet with video: ${tweet.text}</p>`
    };
  
    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully.');
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }
  

module.exports = {
  startScraping,
  stopScraping,
};
