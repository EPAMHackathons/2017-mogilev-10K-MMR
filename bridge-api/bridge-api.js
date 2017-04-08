let movieApi = require('../movie-api/movie-api');
let rutracker = require('../rutracker/rutracker');

module.exports = {
    getMovies: (movieName) => {
        return movieApi.getFilms({
            name: movieName
        });
    },

    getTorrents: (id) => {
        return movieApi.getFilms({
            id
        }).then(filmInfo => {
            return rutracker.getTorrents(filmInfo.title, filmInfo.release_date.clice(0, 4), '');
        });
    },

    getSimilarMovies: () => {
        return true;
    }
};