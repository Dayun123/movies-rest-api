const express = require('express');

const db = require('../src/db/db');
const validate = require('./validate');

const router = express.Router();

router.use(validate.apiKeyExistsInQS, validate.apiKeyValid);

router.get('/', async (req, res, next) => {
  const dbResponse = await db.read('movie');
  res.status(dbResponse.statusCode).json(dbResponse.movies);
});

router.post('/', validate.contentTypeJSON, validate.fieldNames, validate.resource, async (req, res, next) => {
  const dbResponse = await db.create('movie', req.body);
  res.status(dbResponse.statusCode).json(dbResponse);
});

// I need acces to req.baseUrl in the validation middleware, so router.all is prefferred over router.use, as it keeps the baseUrl of the mountpoint.
router.all('/:id', validate.id);

router.get('/:id', async (req, res, next) => {
  const dbResponse = await db.read('movie', req.params.id);
  res.status(dbResponse.statusCode).json(dbResponse.movie);
});

router.delete('/:id', validate.rootApiKeyMatch, async (req, res, next) => {
  const dbResponse = await db.delete('movie', req.params.id);
  res.status(dbResponse.statusCode).json(dbResponse);
});

module.exports = router;
