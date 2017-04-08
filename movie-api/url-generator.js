function UrlGenerator() {
  let self = this;

  self.getFilmsUrlByName = function (name) {
    name.replace(' ', '%20');
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