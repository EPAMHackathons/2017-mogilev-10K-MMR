let urlGenerator = require('./url-generator');
let http = require('http');
let request = require('request');

function callHttp(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
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