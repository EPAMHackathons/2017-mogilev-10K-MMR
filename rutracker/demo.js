let getTorrents = require('./rutracker').getTorrents;


getTorrents("Притяжение", 2017, "Бондарчук").then(res => {
    console.log(res);
})

// [{
//         quality: 'BDRip',
//         data: {
//             size: '1.56 GB',
//             url: 'http://rutracker.org/forum/viewtopic.php?t=4368278',
//             seeds: '61'
//         }
//     },
//     {
//         quality: 'HDRip',
//         data: {
//             size: '1.56 GB',
//             url: 'http://rutracker.org/forum/viewtopic.php?t=3318235',
//             seeds: '4'
//         }
//     }
// ]