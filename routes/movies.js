const express = require('express');

const db = require('../src/db/db');
const validate = require('./validate');

const router = express.Router();

router.use(validate.apiKeyExistsInQS, validate.apiKeyValid);

router.get('/', async (req, res, next) => {
  const dbResponse = await db.read('movie');
  res.status(dbResponse.statusCode).json(dbResponse.movies);
});

router.param('id', validate.id);

router.get('/:id', async (req, res, next) => {
  const dbResponse = await db.read('movie', req.params.id);
  res.status(dbResponse.statusCode).json(dbResponse.movie);
});

router.post('/', validate.contentTypeJSON, validate.fieldNames, validate.resource, async (req, res, next) => {
  const dbResponse = await db.create('movie', req.body);
  res.status(dbResponse.statusCode).json(dbResponse);
});

router.delete('/:id', validate.rootApiKeyMatch, async (req, res, next) => {
  const dbResponse = await db.delete('movie', req.params.id);
  res.status(dbResponse.statusCode).json(dbResponse);
});

module.exports = router;
