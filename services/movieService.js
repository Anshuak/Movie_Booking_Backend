const Movie = require("../models/movieModel");

module.exports.getAllMoviesService = async () => {
    try {
        const movies = await Movie.find().select("movieName movieBanner");
        const set = new Set();
        const newMovies = movies.filter((movie) => {
            if (set.has(movie.movieName)) {
                return false;
            }
            set.add(movie.movieName);
            return movie;
        })
        if (!movies?.length) {
            return { status: 200, message: "No Existing Released Movie found", data: { movies: [] } };
        }
        return { status: 200, message: "Movies found", data: { movies: newMovies } };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}

module.exports.searchMovieByNameService = async (movieName) => {
    try {
        const regex = new RegExp(movieName, 'i');
        const movies = await Movie.find({ movieName: regex });
        console.log(movies);

        if (!movies?.length) {
            return { status: 200, message: "No Existing Released Movie found", data: { movies: [] } };
        }
        return { status: 200, message: "Movies found", data: { movies } };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}