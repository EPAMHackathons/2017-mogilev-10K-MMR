let mockFilms = require('./mock-films');


function movieApi() {

  let self = this;

  self.getFilms = function (params) {
    return new Promise(function (resolve, reject) {
      resolve(mockFilms);
    })
  }

  return self;

}

module.exports = new movieApi();