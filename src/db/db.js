const mongoose = require('mongoose');
const faker = require('faker');
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
  
  let Model = {};
  
  if (resourceType === 'user') {
    Model = User;
    resource.apiKey = faker.random.uuid();
  } else {
    Model = Movie;
  }

  // ensure that resource has ONLY paths that the Schema accepts
  const removePaths = ['_id', '__v'];

  const requiredPaths = Object.keys(Model.schema.paths).filter((path) => {
    return !removePaths.includes(path);
  });

  if (!Object.keys(resource).every((path) => requiredPaths.includes(path))) {
    return {
      statusCode: 400,
      statusMessage: `Cannot create ${Model.modelName} with the given properties.`,
    };
  }

  try {
    const doc = await new Model(resource).save();
    return {
      statusCode: 201,
      statusMessage: `${Model.modelName} created`,
      [Model.modelName.toLowerCase()]: doc,
    };
  } catch (e) {
    console.log(e);
  }

};