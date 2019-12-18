const express = require('express');
const mongoose = require('mongoose');
const Movie = require('../src/models/movie');
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

router.param('id', async (req, res, next, _id) => {

  const errorObj = {
    statusCode: 400,
    statusMessage: `No ${Movie.modelName.toLowerCase()} found with that id`,
  };

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(errorObj.statusCode).json(errorObj);
  } 

  const [ doc ] = await Movie.find({ _id });
  
  if (!doc) {
    return res.status(errorObj.statusCode).json(errorObj);
  }

  next();

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

router.post('/', validate.contentTypeJSON);

router.post('/', async (req, res, next) => {
  try {
    const dbResponse = await db.create('movie', req.body);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

router.use(validate.rootApiKeyMatch);

router.delete('/:id', async (req, res, next) => {
  try {
    const dbResponse = await db.delete('movie', req.params.id);
    res.status(dbResponse.statusCode).json(dbResponse);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
