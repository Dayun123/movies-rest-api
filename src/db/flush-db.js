const mongoose = require('mongoose');
const Movie = require('../models/movie');
const User = require('../models/user');
const dbName = require('../../config.json').dbName;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(`mongodb://localhost:27017/${dbName}`, connectionOptions)
  .catch((error) => {
    console.log('Connection error: ', error);
  });

mongoose.connection.on('error', (error) => {
  console.log(error);
});

mongoose.connection.on('connected', async () => {
  console.log('Flushing db...');
  const deletedMovieData = await Movie.deleteMany({});
  const deletedUserData = await User.deleteMany({});
  console.log(`Deleted ${deletedMovieData.deletedCount} movies and ${deletedUserData.deletedCount} users from the db.`);
  mongoose.connection.close();
});