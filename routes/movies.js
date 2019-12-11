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

router.get('/', (req, res, next) => {
  res.json([{
    msg: "Success",
  }]);
});

module.exports = router;
