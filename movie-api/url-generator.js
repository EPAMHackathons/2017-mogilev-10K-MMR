function UrlGenerator() {
  let self = this;

  self.getFilmsUrlByName = function (name) {
    name = encodeURI(name);
    let parse = `query=${name}`;
    return getUrl('search/movie', parse);
  }

  self.getFilmsUrlById = function (id) {
    return getUrl(`movie/${id}`, '');
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
      params.with_genres.forEach((x, index) => {
        genres += String(x);
        if (index !== params.with_genres.length - 1) {
          genres += '|';
        }
      });
      genres = encodeURI(genres);
      parsed += genres;
    }

    return getUrl('discover/movie', parsed);
  }

  return self;
}

function getUrl(searchAction, query) {
  if (query && query.length > 0 && query[query.length - 1] !== '&') {
    query = `${query}&`
  }
  let template = `https://api.themoviedb.org/3/${searchAction}?api_key=99352ad2ce3f3332250b88df593c863a&${query}language=ru&append_to_response=credits`;
  return template;
}

module.exports = new UrlGenerator();