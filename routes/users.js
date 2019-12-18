const express = require('express');

const db = require('../src/db/db');
const validate = require('./validate');
const utils = require('../src/utils');

const router = express.Router();

router.post('/', validate.contentTypeJSON, validate.fieldNames, validate.resource, async (req, res, next) => {
  const dbResponse = await db.create('user', req.body);
  res.status(dbResponse.statusCode).json(dbResponse);
});

router.use(validate.apiKeyExistsInQS, validate.apiKeyValid);

router.get('/', validate.rootApiKeyMatch, async (req, res, next) => {
  const dbResponse = await db.read('user');
  res.status(dbResponse.statusCode).json(dbResponse.users);
});

router.all('/:id', validate.id, validate.isValidUser);

router.get('/:id', async (req, res, next) => {
  const dbResponse = await db.read('user', req.params.id);
  res.status(dbResponse.statusCode).json(dbResponse.user);
});

router.patch('/:id', validate.contentTypeJSON, validate.fieldNames, async (req, res, next) => {
  const dbResponse = await db.update('user', req.params.id, req.body);
  res.status(dbResponse.statusCode).json(dbResponse);
});

router.delete('/:id', async (req, res, next) => {
  const dbResponse = await db.delete('user', req.params.id);
  res.status(dbResponse.statusCode).json(dbResponse);
});

module.exports = router;