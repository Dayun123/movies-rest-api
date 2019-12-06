const bent = require('bent');
const mongoose = require('mongoose');
const Movie = require('../models/movie');

const getJSON = bent('json');

exports.createMovieData = async () => {
  const movieData = await getJSON('https://api.themoviedb.org/3/movie/popular?api_key=b0f31f3b68b27703024d00cce1fa4366&language=en-US&page=1');
  return movieData.results.map((movie) => {
    const { title, overview, popularity } = movie;
    return new Movie({ title, overview, popularity });
  });
};