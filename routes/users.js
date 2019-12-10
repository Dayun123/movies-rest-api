const express = require('express');
const db = require('../src/db/db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  if (req.get('Content-Type') !== 'application/json') {
    return res.json({
      statusCode: 400,
      statusMessage: 'Requests to POST /users must have the following header: `Content-Type: application/json`',
    });
  }
  try {
    const user = await db.create('user', req.body);
    res.status(user.statusCode).json(user);
  } catch (e) {
    res.json({
      statusCode: 500,
      statusMessage: e,
    });
  }
});

module.exports = router;
