const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const db = require('../src/db/db');
const validate = require('./validate');

const router = express.Router();
const readFile = util.promisify(fs.readFile);
const rootApiKeyPath = path.join(__dirname, '../rootApi.key');

router.post('/', async (req, res, next) => {
  
  // HTTP validation seems logical to include in the route-handler, while resource-level validation is handled in the db.js file
  if (req.get('Content-Type') !== 'application/json') {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: 'Requests to POST /users must have the following header: `Content-Type: application/json`',
    });
  }
  
  try {
    // this could be a successful response which includes the created user, or some sort of error response. If something goes wrong at the db connection level, an the promise will reject and the catch block will run, but otherwise the db.create() method will return a response we can use.
    const dbResponse = await db.create('user', req.body);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    // pass along the error to the app-level error-handling middleware, we expect it to be some sort of db connection issue.
    next(e);
  }

});

router.use(validate.apiKeyExistsInQS);

router.use(async (req, res, next) => {
  
  const rootApiKey = await readFile(rootApiKeyPath, 'utf8');
  
  if (rootApiKey !== req.query.apiKey) {
    return res.status(401).json({
      statusCode: 401,
      statusMessage: 'Must provide a valid API Key',
    });
  }
  
  next();
});

router.get('/', async (req, res, next) => {
  res.json([]);
});

module.exports = router;
