let mockFilms = require('./mock-films');
let urlGenerator = require('./url-generator');
let Tmdb = require('movie-api').Tmdb;
let http = require('http');

const tmdb = new Tmdb({
  apiKey: '99352ad2ce3f3332250b88df593c863a',
  language: 'ru'
});

const getDefaultOptions = () => {
  return {
    path: '',
    method: 'GET'
  }
}

function callHttp(url) {
  return new Promise((resolve, reject) => {
    let options = getDefaultOptions();
    options.path = url;
    http.request(options, function (res) {
      if (res.statusCode == '200') {
        resolve(res);
      } else {
        reject('HTTP code is ' + res.statusCode);
      }
    })
  });
}

function movieApi() {
  let self = this;

  self.getFilms = function (params) {
    let url = '';
    if (params.name) {
      url = urlGenerator.getFilmsUrlByName(params.name);
    }
    if (params.id) {
      url = urlGenerator.getFilmsUrlById(params.id);
    }
    return callHttp(url);
  }

  self.getAllGenres = function () {
    let url = urlGenerator.getAllGenresUrl();
    return callHttp(url);
  }

  return self;
}

module.exports = new movieApi();