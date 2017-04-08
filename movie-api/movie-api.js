
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
let mockFilms = require('./mock-films');


function movieApi() {

  let self = this;

  self.getFilms = function (params) {
    return new Promise(function (resolve, reject) {
      resolve(mockFilms);
    })
  }

  self.getSimilar = function (id) {
    let url = urlGenerator.getSimilarUrl(id);
    return callHttp(url);
  }

  return self;

}

module.exports = new movieApi();