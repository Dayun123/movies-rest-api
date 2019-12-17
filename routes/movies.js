const express = require('express');
const db = require('../src/db/db');
const validate = require('./validate');

const router = express.Router();

router.use(validate.apiKeyExistsInQS);
router.use(validate.apiKeyValid);

router.get('/', async (req, res, next) => {
  try {
    const movies = await db.read('movie');
    res.json(movies);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.read('movie', req.params.id);
    if (dbResponse.statusCode !== 200) {
      return res.status(dbResponse.statusCode).json(dbResponse);
    }
    res.json(dbResponse.movie);
  } catch (e) {
    next(e);
  }
});

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
    const dbResponse = await db.create('movie', req.body);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    // pass along the error to the app-level error-handling middleware, we expect it to be some sort of db connection issue.
    next(e);
  }
});

module.exports = router;
