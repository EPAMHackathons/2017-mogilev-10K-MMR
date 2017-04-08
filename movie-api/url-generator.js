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

  return self;
}

function getUrl(searchAction, query) {
  let template = `https://api.themoviedb.org/3/${searchAction}?api_key=99352ad2ce3f3332250b88df593c863a&${query}language=ru`;
  return template;
}

module.exports = new UrlGenerator();