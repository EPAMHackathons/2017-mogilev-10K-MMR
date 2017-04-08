module.exports.filter = (films) => {
    let filteredFimls = films.filter(film => {
        return (film.category.contains('Фильмы') || film.category.contains('Зарубежное кино') || film.category.contains('Наше кино')) &&
            film.state == 'проверено' &&
            !film.category.contains('iPhone') &&
            !film.category.contains('Apple')
    });

    let results = [];

    let BluRay = getFilmByQuality(filteredFimls, "Blu-ray");
    if (BluRay) {
        addFilmIntoResult(results, BluRay, "Blu-ray");
    }

    let bdRip = getFilmByQuality(filteredFimls, "BDRip");
    if (bdRip) {
        addFilmIntoResult(results, bdRip, "BDRip");
    }

    let hDRip = getFilmByQuality(filteredFimls, "HDRip");
    if (hDRip) {
        addFilmIntoResult(results, hDRip, "HDRip");
    }

    let dvdRip = getFilmByQuality(filteredFimls, "DVDRip");
    if (dvdRip) {
        addFilmIntoResult(results, dvdRip, "DVDRip");
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

function addAdditionalTorrents(results) {
    if (results.length == 0) {
        let webDL = getFilmByQuality(filteredFimls, "WEB-DL");
        if (webDL) {
            addFilmIntoResult(results, webDL, "WEB-DL");
        }
    }

    if (results.length == 0) {
        let dvd = getFilmByQuality(filteredFimls, "DVD");
        if (dvd) {
            addFilmIntoResult(results, dvd, "DVD");
        }
    }

    if (results.length == 0) {
        let tvRip = getFilmByQuality(filteredFimls, "TVRip");
        if (tvRip) {
            addFilmIntoResult(results, tvRip, "TVRip");
        }
    }

    if (results.length == 0) {
        let tvRip = getFilmByQuality(filteredFimls, "TVRip");
        if (tvRip) {
            addFilmIntoResult(results, tvRip, "TVRip");
        }
    }

    if (results.length == 0) {
        let tv = getFilmByQuality(filteredFimls, "TV");
        if (tv) {
            addFilmIntoResult(results, tv, "TV");
        }
    }

    if (results.length == 0) {
        let webDl = getFilmByQuality(filteredFimls, "WEB-DLRip");
        if (webDl) {
            addFilmIntoResult(results, webDl, "WEB-DLRip");
        }
    }
}


String.prototype.contains = function (str, ignoreCase = true) {
    return (ignoreCase ? this.toUpperCase() : this)
        .indexOf(ignoreCase ? str.toUpperCase() : str) >= 0;
};