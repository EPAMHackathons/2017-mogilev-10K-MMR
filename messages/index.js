var restify = require('restify');
var builder = require('botbuilder');
var bridgeApi = require('../bridge-api/bridge-api');

var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// var bot = new builder.UniversalBot(connector);
//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
// var server = restify.createServer();
// server.listen(function () {
//     console.log('%s listening to %s', server.name, server.url);
// });
if (useEmulator) {
    var server = restify.createServer();
    server.listen(8080, function () {
        console.log('test bot endpont at http://localhost:8080/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = {
        default: connector.listen()
    }
}
// Create chat bot
// var connector = new builder.ChatConnector({
//     appId: "420370ab-6e82-4287-af5d-3920fbfd59f7",
//     appPassword: "URDKo7QkbQXkm6FFqCk4nb9"
// });
var bot = new builder.UniversalBot(connector);
// server.post('/api/messages', connector.listen());
//Bot on
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
            .address(message.address)
            .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});
bot.on('typing', function (message) {
    // User is typing
});
bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});

String.prototype.contains = function (content) {
    return this.indexOf(content) !== -1;
}
// bot.dialog('/', function (session) {
//     if (session.message.text.toLowerCase().contains('hello')) {
//         session.send(`Hey, How are you?`);
//     } else if (session.message.text.toLowerCase().contains('help')) {
//         session.send(`How can I help you?`);
//     } else {
//         session.send(`Sorry I don't understand you...`);
//     }
// });

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('пока', 'Пока :)', {
    matches: /^пока/i
});

bot.beginDialogAction('помощь', '/помощь', {
    matches: /^помощь/i
});

bot.beginDialogAction('меню', '/меню', {
    matches: /^меню|показать меню/i
});

bot.beginDialogAction('фильм', '/фильм', {
    matches: /^фильм/i
});

bot.beginDialogAction('похожее', '/похожее', {
    matches: /^похожее/i
});

bot.beginDialogAction('порекомендуй', '/порекомендуй', {
    matches: /^порекомендуй/i
});

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        // var card = new builder.HeroCard(session)
        //     .title("Кинобот")
        //     .text("Фильмы!!!")
        //     .images([
        //         builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
        //     ]);
        // var msg = new builder.Message(session).attachments([card]);
        // session.send(msg);
        // session.send("Привет, я бот для фильмов!!!");
        // session.beginDialog('/помощь');
    },
    function (session, results) {
        // Display menu
        // session.beginDialog('/меню');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/меню', [
    function (session) {
        let userMessage = session.message.text.toLowerCase();
        let commands = 'фильм|похожие фильмы|топ|жанры|(выход)';

        if (userMessage.contains('привет')) {
            builder.Prompts.choice(session, "Привет, что ты хочешь найти?", commands);
        } else if (userMessage.contains('что ты можешь') || userMessage.contains('что ты умеешь')) {
            builder.Prompts.choice(session, "Вот список доступных команд: ", commands);
        } else {
            builder.Prompts.choice(session, "Что ты хочешь найти?", commands);
        }
    },
    function (session, results) {
        if (results.response && results.response.entity != '(выход)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    }
]).triggerAction({
    matches: /^меню|показать меню|привет|что ты можешь|что ты умеешь/i
});

bot.dialog('/помощь', [
    function (session) {
        session.endDialog("Список команд :\n\n* меню - возвращает меню.\n* пока - завершить разговор.\n* помощь - Список команд");
    }
]).triggerAction({
    matches: /^помощь|помоги|cписок команд|команды/i
});

// фильм терминатор
// фильм социальная сеть
// порекомендуй боевик
bot.dialog('/порекомендуй', [function (session) {
    let genre = (session.message.text.toLowerCase().slice(13, session.message.text.length));
    let choice = '';

    bridgeApi.searchMovies([], [genre]).then((films) => {
        let attachments = films.results.map((film) => {
            choice = choice.concat(`${film.title} (${film.id})|`);

            return new builder.HeroCard(session)
                .title(film.title)
                .text(`Описание: ${film.overview.slice(0, 40)}...`)
                .images([
                    builder.CardImage.create(session, films.storage_host_url + film.poster_path)
                ])
                .buttons([
                    builder.CardAction.imBack(session, `${film.title} (${film.id})`, "Список торрентов")
                ]);
        });

        choice = choice.slice(0, choice.length - 1);

        let msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments(attachments);

        if (films.results.length > 1) {
            msg.attachmentLayout(builder.AttachmentLayout.carousel)
        }

        builder.Prompts.choice(session, msg, choice);
    })
}, function (session, results) {
    var action, item;

    let filmName = results.response.entity;
    let splitedName = filmName.split(' ');
    let filmId = splitedName[splitedName.length - 1].slice(1, splitedName[splitedName.length - 1].length - 1);

    bridgeApi.getTorrents(filmId).then(torrents => {
        let msg = '';

        torrents.forEach(t => {
            msg = msg.concat(`Качество: ${t.quality}, размер: ${t.data.size}, ссылка: ${t.data.url}, сиды: ${t.data.seeds}\n\n`)
        });

        session.endConversation(msg);
    });
}]);


// фильм терминатор
// фильм социальная сеть
bot.dialog('/фильм', [function (session) {
    let filmName = (session.message.text.toLowerCase().slice(6, session.message.text.length));
    let choice = '';

    bridgeApi.getMovies({
        name: filmName
    }).then((films) => {
        let attachments = films.results.map((film) => {
            choice = choice.concat(`${film.title} (${film.id})|`);

            return new builder.HeroCard(session)
                .title(film.title)
                .text(`Описание: ${film.overview.slice(0, 40)}...`)
                .images([
                    builder.CardImage.create(session, films.storage_host_url + film.poster_path)
                ])
                .buttons([
                    builder.CardAction.imBack(session, `${film.title} (${film.id})`, "Список торрентов")
                ]);
        });

        choice = choice.slice(0, choice.length - 1);

        let msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments(attachments);

        if (films.results.length > 1) {
            msg.attachmentLayout(builder.AttachmentLayout.carousel)
        }

        builder.Prompts.choice(session, msg, choice);
    })
}, function (session, results) {
    var action, item;

    let filmName = results.response.entity;
    let splitedName = filmName.split(' ');
    let filmId = splitedName[splitedName.length - 1].slice(1, splitedName[splitedName.length - 1].length - 1);

    bridgeApi.getTorrents(filmId).then(torrents => {
        let msg = '';

        torrents.forEach(t => {
            msg = msg.concat(`Качество: ${t.quality}, размер: ${t.data.size}, ссылка: ${t.data.url}, сиды: ${t.data.seeds}\n\n`)
        });

        session.endConversation(msg);
    });
}]);

bot.dialog('/жанры', function (session) {
    let msg = 'Доступные жанры:';
    let genres = getGenres().map(g => g.name);

    genres.forEach(name => msg = msg.concat(`\n\n${name}`));

    builder.Prompts.text(session, msg);
}).triggerAction({
    matches: /^жанры/i
});
//похожие на социальная сеть
bot.dialog('/похожее', [function (session) {
    let filmName = (session.message.text.toLowerCase().slice(8, session.message.text.length));
    getSimilar(filmName, session);
}]);

function getSimilar(filmName, session) {
    bridgeApi.getMovies({
        name: filmName
    }).then((queryFilms) => {
        if (queryFilms.results && queryFilms.results.length == 1) {
            return bridgeApi.getSimilar(queryFilms.results[0].id);
        }

    }).then((films) => {
        let choice = '';
        let attachments = films.results.map((film) => {
            choice = choice.concat(`${film.title} (${film.id})|`);

            return new builder.HeroCard(session)
                .title(film.title)
                .text(`Описание: ${ (film.overview? film.overview.slice(0, 40): "нету")}...`)
                .images([
                    builder.CardImage.create(session, films.storage_host_url + film.poster_path)
                ])
                .buttons([
                    builder.CardAction.imBack(session, `${film.title} (${film.id})`, "Список торрентов"),
                    builder.CardAction.imBack(session, `${film.title} (${film.id})`, "Похожие фильмы")
                ]);
        });

        choice = choice.slice(0, choice.length - 1);

        let msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments(attachments);

        if (films.results.length > 1) {
            msg.attachmentLayout(builder.AttachmentLayout.carousel)
        }

        builder.Prompts.choice(session, msg, choice);
    })
}

/**
 * @param {string} filmName 
 */
let getFilms = (filmName) => {
    return [{
        "poster_path": "https://image.tmdb.org/t/p/w640/ikUhOSuKOd9Sjf6dVP585lFtiLb.jpg",
        "adult": false,
        "overview": "Во времена гражданской войны Галактическая империя угрожала подавить народное восстание с помощью совершенного оружия: Звезды смерти. Принцесса Лиа и повстанческий альянс одержали важную победу, но праздновать некогда. Чтобы избежать преследования за уничтожение Звезды смерти они принимают решение эвакуироваться на секретную базу, которая находится на Хоте…",
        "release_date": "2012-09-24",
        "genre_ids": [
            878,
            16,
            28,
            10751,
            35
        ],
        "id": 136406,
        "original_title": "Lego Star Wars: The Empire Strikes Out",
        "original_language": "en",
        "title": "LEGO Звездные войны: Империя наносит удар",
        "backdrop_path": "/9k36XxWzys6yAgjG8sjoRhPU0HT.jpg",
        "popularity": 1.792003,
        "vote_count": 11,
        "video": false,
        "vote_average": 5.9
    }]
}

/**
 * 
 */
let getGenres = () => {
    return [{
            "id": 28,
            "name": "боевик"
        },
        {
            "id": 12,
            "name": "приключения"
        },
        {
            "id": 16,
            "name": "мультфильм"
        },
        {
            "id": 35,
            "name": "комедия"
        },
        {
            "id": 80,
            "name": "криминал"
        },
        {
            "id": 99,
            "name": "документальный"
        },
        {
            "id": 18,
            "name": "драма"
        },
        {
            "id": 10751,
            "name": "семейный"
        },
        {
            "id": 14,
            "name": "фэнтези"
        },
        {
            "id": 36,
            "name": "история"
        },
        {
            "id": 27,
            "name": "ужасы"
        },
        {
            "id": 10402,
            "name": "музыка"
        },
        {
            "id": 9648,
            "name": "детектив"
        },
        {
            "id": 10749,
            "name": "мелодрама"
        },
        {
            "id": 878,
            "name": "фантастика"
        },
        {
            "id": 10770,
            "name": "tелевизионный фильм"
        },
        {
            "id": 53,
            "name": "триллер"
        },
        {
            "id": 10752,
            "name": "военный"
        },
        {
            "id": 37,
            "name": "вестерн"
        }
    ]
}

// bridgeApi.registerUser(1, 2, {}).then(result => {
//     console.log(result);
//     // bridgeApi.getUser(1).then(result => {
//     //     console.log(result);
//     // });
// });

// bridgeApi.getAllUsers().then(result => {
//     console.log(result);
// });

// bridgeApi.getMovies('звездные').then(response => {
//     console.log(response);
// });

// bridgeApi.getUserData(1, 2).then(result => {
//     console.log(result);
// });

// bridgeApi.removeUserData(1, 2).then(result => {
//     console.log(result);
// });
