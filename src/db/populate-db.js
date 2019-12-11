const mongoose = require('mongoose');
const utils = require('../utils');
const movies = require('./movies');
const users = require('./users');

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbName = process.argv[2];

if (!dbName) return console.log('Must enter a DB name!');

mongoose.connect(`mongodb://localhost:27017/${dbName}`, connectionOptions)
  .catch((error) => {
    console.log('Connection error: ', error);
  });

mongoose.connection.on('error', (error) => {
  console.log(error);
});

mongoose.connection.on('connected', async () => {
  console.log('Connected successfully to DB!');
  try {
    const movieData = await movies.createMovieData();
    await Promise.all(movieData.map((movie) => movie.save()));
    await Promise.all(users.map((user) => user.save()));
    await utils.createRootApiKeyFile();
    await utils.createConfigFile(dbName);
    console.log('Successfully populated the DB!');
    mongoose.connection.close();
  } catch (e) {
    console.log(e);
  }
});




