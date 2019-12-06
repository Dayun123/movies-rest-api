const bent = require('bent');
const mongoose = require('mongoose');
const Movie = require('../models/movie');

const getJSON = bent('json');

const getMovieData = async () => {
  const movieData = await getJSON('https://api.themoviedb.org/3/movie/popular?api_key=b0f31f3b68b27703024d00cce1fa4366&language=en-US&page=1');
  return movieData.results.map((movie) => {
    const { title, overview, popularity } = movie;
    return new Movie({ title, overview, popularity });
  });
};

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
    const movieData = await getMovieData();
    movieData.forEach(async (movie) => await movie.save());
  } catch (e) {
    console.log(e);
  }

});




