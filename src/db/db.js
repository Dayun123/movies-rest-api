const mongoose = require('mongoose');
const User = require('../models/user');
const Movie = require('../models/movie');

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/moviesRestAPI', connectionOptions)
  .catch((error) => {
    console.log('Connection error: ', error);
  });

exports.create = async (resourceType, resource) => {
  const Model = resourceType === 'user' ? User : Movie;
  try {
    return await new Model(resource).save();
  } catch (e) {
    console.log(e);
  }
};