function UrlGenerator() {
  let self = this;

  self.getFilmsUrlByName = function (name) {
    let parse = `query=${name}`;
    return getUrl('search/movie', parse);
  }

  self.getFilmsUrlById = function (id) {
    let parse = String(id);
    return getUrl('movie', parse);
  }

  self.getAllGenresUrl = function () {
    return getUrl('genre/movie/list', '');
  }

  self.getSimilarUrl = function (id) {
    return getUrl(`movie/${id}/similar`, '');
  }

  self.getFilmsByParams = function (params) {
    let parsed = 'sort_by=vote_average.desc&';
    if (params.with_genres) {
      let genres = '';
      params.with_genres
      genres = encodeURI(genres);
      parsed += genres;
    }

    parsed += parseParamsArray(params.with_genres);
    parsed += parseParamsArray(params.with_people);

    function parseParamsArray(arr) {
      let result = "";
      if (arr.length > 0) {
        arr.forEach((x, index) => {
          result += String(x);
          if (index !== arr.length - 1) {
            result += '|';
          }
        });
      }
      return result;
    }

    return getUrl('discover/movie', parsed);
  }

  self.getPeopleUrl = function (query) {
    return getUrl('search/person', `query=${query}`);
  }

  return self;
}

function getUrl(searchAction, query) {
  if (query && query.length > 0 && query[query.length - 1] !== '&') {
    query = `${query}&`
  }
  let template = encodeURI(`https://api.themoviedb.org/3/${searchAction}?api_key=99352ad2ce3f3332250b88df593c863a&${query}language=ru&append_to_response=credits`);
  return template;
}

module.exports = new UrlGenerator();