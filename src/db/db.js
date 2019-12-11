const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/user');
const Movie = require('../models/movie');
const dbName = require('../../config.json').dbName;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(`mongodb://localhost:27017/${dbName}`, connectionOptions)
  .catch((error) => {
    console.log('Connection error: ', error);
  });

const validatePaths = (Model, resource) => {

  // these come stock on Mongoose models, need to strip them from the Model since the passed in resource should not be expected to include these paths
  const removePaths = ['_id', '__v'];

  const requiredPaths = Object.keys(Model.schema.paths).filter((path) => {
    return !removePaths.includes(path);
  });

  return Object.keys(resource).every((path) => requiredPaths.includes(path));
};

exports.create = async (resourceType, resource) => {
  
  let Model = {};
  
  if (resourceType === 'user') {
    Model = User;
    resource.apiKey = faker.random.uuid();
  } else {
    Model = Movie;
  }

  if (!validatePaths(Model, resource)) {
    return {
      statusCode: 400,
      statusMessage: `Cannot create ${Model.modelName} with the given properties.`,
    };
  }

  const doc = new Model(resource);

  try {
    await doc.validate();
  } catch (e) {
    return {
      statusCode: 400,
      statusMessage: e.message,
    };
  }

  // this isn't in a try...catch because the caller is expected to provide that logic. If an error is thrown here we assume it is something at the database connection level, since validations have already been run on the document to save.
  const savedDoc = await doc.save();

  return {
    statusCode: 201,
    statusMessage: `${Model.modelName} created`,
    [Model.modelName.toLowerCase()]: savedDoc,
  };

};