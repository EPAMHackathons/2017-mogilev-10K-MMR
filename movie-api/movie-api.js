let urlGenerator = require('./url-generator');
let http = require('http');
let request = require('request');

function callHttp(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        let response = JSON.parse(body);
        response.storage_host_url = 'https://image.tmdb.org/t/p/w640/';
        resolve(response);
      }
    });
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
    if (url.length === 0) {
      url = urlGenerator.getFilmsByParams(params);
    }
    return callHttp(url);
  }

  self.getAllGenres = function () {
    let url = urlGenerator.getAllGenresUrl();
    return callHttp(url);
  }

  self.getSimilar = function (id) {
    let url = urlGenerator.getSimilarUrl(id);
    return callHttp(url);
  }

  return self;
}

module.exports = new movieApi();