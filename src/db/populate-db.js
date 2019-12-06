const mongoose = require('mongoose');
const movies = require('./movies');

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost:27017/moviesRestAPI', connectionOptions)
  .catch((error) => {
    console.log('Connection error: ', error);
  });

mongoose.connection.on('error', (error) => {
  console.log(error);
});

mongoose.connection.on('connected', async () => {
  console.log('Connected successfully to DB!');
  
  try {
    const movieData = await movies.getMovieData();
    movieData.forEach(async (movie) => await movie.save());
  } catch (e) {
    console.log(e);
  }

});




