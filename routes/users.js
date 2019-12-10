const express = require('express');
const db = require('../src/db/db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  
  // HTTP validation seems logical to include in the route-handler, while resource-level validation is handled in the db.js file
  if (req.get('Content-Type') !== 'application/json') {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: 'Requests to POST /users must have the following header: `Content-Type: application/json`',
    });
  }
  
  try {
    const user = await db.create('user', req.body);
    res.status(user.statusCode).json(user);
  } catch (e) {
    // pass along the error to the app-level error-handling middleware
    next(e);
  }

});

module.exports = router;
