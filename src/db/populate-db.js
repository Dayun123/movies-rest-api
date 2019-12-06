const bent = require('bent')

const getJSON = bent('json')

(async () => {
  const movieData = await getJSON('https://api.themoviedb.org/3/movie/popular?api_key=b0f31f3b68b27703024d00cce1fa4366&language=en-US&page=1');
  console.log(movieData);
})();
