const express = require('express');
const db = require('../src/db/db');
const validate = require('./validate');
const utils = require('../src/utils');

const router = express.Router();

router.post('/', validate.contentTypeJSON);

router.post('/', async (req, res, next) => {
  try {
    const dbResponse = await db.create('user', req.body);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

router.use(validate.apiKeyExistsInQS);
router.use(validate.apiKeyValid);

router.get('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.read('user', req.params.id);
    if (dbResponse.statusCode !== 200) {
      return res.status(dbResponse.statusCode).json(dbResponse);
    }
    const isValidUser = await validate.currentUserOrRootUser(req.query.apiKey, dbResponse.user.apiKey);
    if (!isValidUser) {
      return res.status(401).json({
        statusCode: 401, 
        statusMessage: 'API Key does not match the user id or the root user',
      });
    }
    res.json(dbResponse.user);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.update('user', req.params.id, req.body);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.delete('user', req.params.id);
    if (dbResponse.statusCode !== 200) {
      return res.status(dbResponse.statusCode).json(dbResponse);
    }
    const isValidUser = await validate.currentUserOrRootUser(req.query.apiKey, dbResponse.user.apiKey);
    if (!isValidUser) {
      return res.status(401).json({
        statusCode: 401, 
        statusMessage: 'API Key does not match the user id or the root user',
      });
    }
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

router.use(validate.rootApiKeyMatch);

router.get('/', async (req, res, next) => {
  try {
    const users = await db.read('user');
    res.json(users);
  } catch (e) {
    next(e);
  }
});

module.exports = router;