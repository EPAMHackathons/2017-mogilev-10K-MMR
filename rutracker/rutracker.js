let RutrackerApi = require('./rutracker-api-fork');
let filmFilter = require('./filters');

let rutrackerApi = new RutrackerApi();
let userName = 'hackathon-n';
let pass = 'OBLIVION';

module.exports = {
    getTorrents: function (title, year, producer) {
        return Promise.resolve(true).then(() => {
            return rutrackerApi.login(userName, pass);
        }).then(() => {
            let query = title + ' ' + year + ' ' + producer;
            return rutrackerApi.search(query);
        }).then(filmsSource => {
            if (filmsSource) {
                return filmFilter.filter(filmsSource);
            } else {
                return [];
            }
        }).catch(err => {
            console.log('--------THIS IS ERROR--------');
            console.log(err);
            return [];
        })
    },

    getProducer: function (filmInfo) {
        if (filmInfo.creds && filmInfo.creds.crew) {
            let producers = filmInfo.creds.crew.filter(cred => cred.job == "Director");
            if (producers && producers.length == 1) {
                return producers.name.substring(producers.name.lastIndexOf(" ") + 1);
            }
        }
    }

}