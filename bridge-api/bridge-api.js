let movieApi = require('../movie-api/movie-api');

module.exports = {
    getMovies: (movieName) => {
        return movieApi.getFilms({
            name: movieName
        });
    },

    getSimilarMovies: () => {
        return true;
    }
};