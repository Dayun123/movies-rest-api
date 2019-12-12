const express = require('express');
const db = require('../src/db/db');

const router = express.Router();

router.use(async (req, res, next) => {
  
  if (!req.query.apiKey) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: `Access to ${req.method} ${req.baseUrl} requires an apiKey in the query string`,
    });
  }

  const isValidApiKey = await db.validateApiKey(req.query.apiKey);

  if (!isValidApiKey) {
    return res.status(401).json({
      statusCode: 401,
      statusMessage: 'Must provide a valid API Key',
    });
  } 

  next();
  
});

router.get('/', async (req, res, next) => {
  try {
    const movies = await db.read('movie');
    res.json(movies);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  res.json({ 
    "_id" : "5df06bc5ef01ea368071c11f", 
    "title" : "Jurassic Galaxy", 
    "overview" : "In the near future, a ship of space explorers crash land on an unknown planet. They're soon met with some of their worst fears as they discover the planet is inhabited by monstrous dinosaurs.", 
    "releaseDate" : "2018-08-20T00:00:00Z",
  });
});

module.exports = router;
