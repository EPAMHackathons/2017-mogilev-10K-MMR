let movieApi = require('../movie-api/movie-api');
let rutracker = require('../rutracker/rutracker');
let mongoApi = require('./mongo-api');

module.exports = {
    getMovies: (params) => {
        return movieApi.getFilms(params).then(items => {
            let moviesCollection = [];
            if (params) {
                moviesCollection = items.results.map(item => {
                    item.is_watched = false;
                    return item;
                });

                return new Promise((resolve, reject) => {
                    items.results = moviesCollection;
                    resolve(items);
                });
            }
        });
    },

    /**
     * @data: {movies: []}
     */
    registerUser: (chatId, chatType, data) => {
        return new Promise((resolve, reject) => {
            mongoApi.insertDocuments({'collectionName': 'users', 'collection': [
                {
                    userId: `${chatId}-${chatType}`,
                    chatType: chatType,
                    chatId: chatId,
                    data: data
                }
                ]},
                (result) => {
                    resolve(result);
                });
        });
    },

    /**
     * @result: {userId: '', chatType: '', chatId: '', data: {movies: []}}
     */
    getUserData: (chatId, chatType, data) => {
        return new Promise((resolve, reject) => {
            mongoApi.findAllDocuments({'collectionName': 'users', 'identifier': { userId: `${chatId}-${chatType}` }}, (result) => {
                if (result && result.length) {
                    resolve(result);
                } else {
                    mongoApi.insertDocuments({'collectionName': 'users', 'collection': [{
                            userId: `${chatId}-${chatType}`,
                            chatType: chatType,
                            chatId: chatId,
                            data: data
                        }
                    ]},
                    (result) => {
                        resolve(result);
                    });
                }
            });
        })
    },

    removeUserData: (chatId, chatType) => {
        return new Promise((resolve, reject) => {
            mongoApi.deleteDocument({'collectionName': 'users', 'identifier': { userId: `${chatId}-${chatType}` }}, (result) => {
                try {
                    resolve(result);
                } catch (e) {
                    console.warn(e);
                }
            });
        });
    },

    updateUserData: (chatId, chatType, value) => {
        return new Promise((resolve, reject) => {
            mongoApi.updateDocument({'collectionName': 'users', 'identifier': { userId: `${chatId}-${chatType}` }, 'value': value}, (result) => {
                try {
                    resolve(result);
                } catch (e) {
                    console.warn(e);
                }
            });
        });
    },

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            mongoApi.findAllDocuments({'collectionName': 'users', 'identifier': {}}, (result) => {
                if (result) {
                    resolve(result);
                }
            });
        })
    },

    markAsWatched: (movieId, movies) => {
        return movies.map(movie => {
            if (movie.id === movieId) {
                movie.is_watched = true;
            }
            return movie;
        })
    },

    getTorrents: (id) => {
        return movieApi.getFilms({
            id
        }).then(filmInfo => {
            let producer = getProducer(filmInfo);
            return rutracker.getTorrents(filmInfo.title, filmInfo.release_date.slice(0, 4), producer);
        });
    }

};


let getProducer = (filmInfo) => {
    if (filmInfo.credits && filmInfo.credits.crew) {
        let producers = filmInfo.credits.crew.filter(cred => cred.job == "Director");
        if (producers && producers.length == 1) {
            return producers[0].name.substring(producers[0].name.lastIndexOf(" ") + 1);
        }
    }
}