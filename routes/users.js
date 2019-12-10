const express = require('express');
const db = require('../src/db/db');

const router = express.Router();

router.post('/', (req, res, next) => {
  if (req.get('Content-Type') !== 'application/json') {
    return res.json({
      statusCode: 400,
      statusMessage: 'Requests to POST /users must have the following header: `Content-Type: application/json`',
    });
  }
  res.json(db.create('user', req.body));
});

module.exports = router;
