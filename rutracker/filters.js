module.exports.filter = (films) => {
    let filteredFimls = films.filter(film => {
        return (film.category.contains('Фильмы') || film.category.contains('Зарубежное кино')) &&
            film.state == 'проверено' &&
            !film.category.contains('iPhone') &&
            !film.category.contains('Apple')
    });

    let results = [];

    let bdRip = getFilmByQuality(filteredFimls, "BDRip");
    if (bdRip) {
        addFilmIntoResult(results, bdRip, "BDRip");
    }

    let hDRip = getFilmByQuality(filteredFimls, "HDRip");
    if (hDRip) {
        addFilmIntoResult(results, hDRip, "HDRip");
    }

    return results;
}

function getFilmByQuality(films, quality) {
    let filmsByQuality = films.filter(film => {
        return film.title.contains(quality);
    });
    if (!filmsByQuality || (filmsByQuality && filmsByQuality.length == 0)) {
        return null;
    }
    return filmsByQuality.reduce((prev, current) => {
        return (prev.seeds > current.seeds) ? prev : current
    });
}

function addFilmIntoResult(results, film, quality) {
    results.push({
        quality: quality,
        data: {
            size: film.size,
            url: film.url,
            seeds: film.seeds
        }
    });
}


String.prototype.contains = function (str, ignoreCase = true) {
    return (ignoreCase ? this.toUpperCase() : this)
        .indexOf(ignoreCase ? str.toUpperCase() : str) >= 0;
};