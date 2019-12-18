const express = require('express');
const mongoose = require('mongoose');
const User = require('../src/models/user');
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

router.param('id', async (req, res, next, _id) => {

  const errorObj = {
    statusCode: 400,
    statusMessage: `No ${User.modelName.toLowerCase()} found with that id`,
  };

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(errorObj.statusCode).json(errorObj);
  } 

  const [ doc ] = await User.find({ _id });
  
  if (!doc) {
    return res.status(errorObj.statusCode).json(errorObj);
  }

  next();

});

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

router.patch('/:id', validate.contentTypeJSON);

router.patch('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.update('user', req.params.id, req.body);
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