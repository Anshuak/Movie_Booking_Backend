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
        // console.error(err);
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
        let tickets = await Ticket.find({ movieName, theatreName });
        console.log(tickets)
        if (tickets.length) {
            return { status: 400, message: "Cannot delete movie" };
        }

        const movie = await Movie.findOne({ movieName, theatreName })

        console.log(movie)

        await Movie.findByIdAndDelete(movie._id);

        return { status: 200, message: "Movie deleted successfully" };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}

module.exports.addMovieService = async (movie) => {
    try {
        // check movie is present or not
        let isMoviePresent = await Movie.findOne({ movieName: movie.movieName, theatreName: movie.theatreName });
        if (isMoviePresent) {
            return { status: 400, message: "Movie Already Present" };
        }

        const newMovie = new Movie({ ...movie })
        const savedMovie = await newMovie.save()

        return { status: 201, message: "Movie added successfully" };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}


module.exports.updateMovieService = async (movieId, movie) => {
    try {
        // check movie is present or not
        let isMoviePresent = await Movie.findById(movieId);
        if (!isMoviePresent) {
            return { status: 400, message: "Movie Not Present" };
        }

        let updatedMovie = await Movie.findByIdAndUpdate(movieId, movie);

        return { status: 200, message: "Movie updated successfully" };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}
