let api = require('./movie-api');

api.getFilms({ name: 'Социальная сеть' })
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
