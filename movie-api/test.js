let api = require('./movie-api');

api.getFilms().then((data) => {
  console.log(data);
})