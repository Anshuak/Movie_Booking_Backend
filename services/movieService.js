const Movie = require("../models/movieModel");
const Ticket = require("../models/ticketModel");

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

module.exports.deleteMovieService = async (movieName, theatreName) => {
    try {

        // check movie is present or not
        let isMoviePresent = await Movie.findOne({ movieName, theatreName });
        if (!isMoviePresent) {
            return { status: 400, message: "No Movie Found" };
        }

        // check for this movie any tickets are booked
        let tickets = await Ticket.find({ movieName });
        if (tickets.length) {
            return { status: 400, message: "Cannot delete movie" };
        }

        const movies = await Movie.find({ movieName })

        for (let movie of movies) {
            await Movie.findByIdAndDelete(movie._id);
        }
        return { status: 200, message: "Movie deleted successfully" };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}