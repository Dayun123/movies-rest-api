const express = require('express');
const db = require('../src/db/db');

const router = express.Router();

router.use((req, res, next) => {
  if (!req.query.apiKey) {
    res.status(400).json({
      statusCode: 400,
      statusMessage: `Access to ${req.method} ${req.baseUrl} requires an apiKey in the query string`,
    });
  } else {
    next();
  }
});

router.use(async (req, res, next) => {
  const isValidApiKey = await db.validateApiKey(req.query.apiKey);
  if (!isValidApiKey) {
    res.status(401).json({
      statusCode: 401,
      statusMessage: 'Must provide a valid API Key',
    });
  } else {
    next();
  }
});

router.get('/', async (req, res, next) => {
  try {
    const movies = await db.read('movie');
    res.json(movies);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
