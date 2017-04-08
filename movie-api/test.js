let api = require('./movie-api');

api.getFilms({ name: 'Звездные войны' })
  .then((data) => {
    console.log(data);
  }, (err) => {
    console.log(err);
  });

api.getFilms({ id: 37799 })
  .then((data) => {
    console.log(data);
  }, (err) => {
    console.log(err);
  });

api.getSimilar(37799)
  .then((data) => {
    console.log(data);
  });

api.getAllGenres()
  .then((data) => {
    console.log(data);
  });

api.getFilms({
  with_genres: [12, 28]
})
  .then((data) => {
    console.log(data);
  });
