const express = require('express');
const validUrl = require('valid-url');
const Url = require('../models/Url');
const router = express.Router();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper to generate a random short code
function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /shorten
router.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url || !validUrl.isWebUri(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }
  try {
    // Check if already exists
    let existing = await Url.findOne({ originalUrl: url });
    if (existing) {
      return res.json({ shortUrl: `${BASE_URL}/${existing.shortCode}` });
    }
    // Generate unique code
    let shortCode;
    let urlWithCode;
    do {
      shortCode = generateShortCode();
      urlWithCode = await Url.findOne({ shortCode });
    } while (urlWithCode);

    const newUrl = new Url({ originalUrl: url, shortCode });
    await newUrl.save();
    res.json({ shortUrl: `${BASE_URL}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:code
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const urlDoc = await Url.findOne({ shortCode: code });
    if (!urlDoc) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    // Check expiry
    if (urlDoc.expiryDate && urlDoc.expiryDate < new Date()) {
      return res.status(410).json({ error: 'Short URL expired' });
    }
    // Increment click count
    urlDoc.clickCount += 1;
    await urlDoc.save();
    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 