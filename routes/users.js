const express = require('express');

const db = require('../src/db/db');
const validate = require('./validate');
const utils = require('../src/utils');

const router = express.Router();

router.post('/', validate.contentTypeJSON, validate.fieldNames, validate.resource, async (req, res, next) => {
  try {
    const dbResponse = await db.create('user', req.body);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

router.use(validate.apiKeyExistsInQS);
router.use(validate.apiKeyValid);

router.get('/', validate.rootApiKeyMatch, async (req, res, next) => {
  try {
    const dbResponse = await db.read('user');
    res.status(dbResponse.statusCode).json(dbResponse.users);
  } catch (e) {
    next(e);
  }
});

// router.param does not accept an array of middleware functions, so you have to call it for each middleware function you want to run against the param.
router.param('id', validate.id);
router.param('id', validate.isValidUser);

router.get('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.read('user', req.params.id);
    res.json(dbResponse.user);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', validate.contentTypeJSON, validate.fieldNames, async (req, res, next) => {
  try {
    const dbResponse = await db.update('user', req.params.id, req.body);
    if (dbResponse.statusCode !== 200) {
      return res.status(dbResponse.statusCode).json(dbResponse);
    }
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.delete('user', req.params.id);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

module.exports = router;