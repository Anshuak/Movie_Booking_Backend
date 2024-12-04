const Movie = require("../models/movieModel");
const Ticket = require("../models/ticketModel");
const { movieValidation } = require("../validations/validation");

module.exports.getAllMoviesService = async () => {
    try {
        const movies = await Movie.find();
        const set = new Set();
        // const newMovies = movies.filter((movie) => {
        //     if (set.has(movie.movieName)) {
        //         return false;
        //     }
        //     set.add(movie.movieName);
        //     return movie;
        // })
        if (!movies?.length) {
            return { status: 200, message: "No Existing Released Movie found", data: { movies: [] } };
        }
        return { status: 200, message: "Movies found", data: { movies } };
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

module.exports.deleteMovieService = async (movieId) => {
    try {

        // check movie is present or not
        console.log('delte movie', movieId)
        let movieData = await Movie.findById(movieId);
        if (!movieData) {
            return { status: 400, message: "No Movie Found" };
        }

        let { movieName, theatreName } = movieData;

        // check for this movie any tickets are booked
        let tickets = await Ticket.find({ movieName, theatreName });
        console.log(tickets)
        if (tickets.length) {
            return { status: 400, message: "Cannot delete movie since tickets booked against it" };
        }

        const movie = await Movie.findOne({ movieName, theatreName })

        console.log(movie)

        const deletedMovie = await Movie.findByIdAndDelete(movie._id);

        return { status: 200, message: "Movie deleted successfully", movie: deletedMovie };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}

module.exports.addMovieService = async (movie) => {
    try {
        // check movie is present or not
        let validation = movieValidation(movie);
        console.log(validation.fails())
        if (validation.fails()) {
            console.log(validation.errors.all())
            return { status: 400, message: "Invalid", errors: validation.errors.all() };
        }
        let isMoviePresent = await Movie.findOne({ movieName: movie.movieName, theatreName: movie.theatreName });
        if (isMoviePresent) {
            return { status: 400, message: "Movie Already Present" };
        }

        const newMovie = new Movie({ ...movie })
        const savedMovie = await newMovie.save()
        console.error(' thus');
        console.log(savedMovie)

        return { status: 201, message: "Movie added successfully", movie: savedMovie };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}


module.exports.updateMovieService = async (movieId, movie) => {
    try {
        // check movie is present or not
        let validation = movieValidation(movie);
        console.log(validation.fails())
        if (validation.fails()) {
            console.log(validation.errors.all())
            return { status: 400, message: "Invalid", errors: validation.errors.all() };
        }
        let isMoviePresent = await Movie.findById(movieId);
        if (!isMoviePresent) {
            return { status: 400, message: "Movie Not Present" };
        }


        let isMovieAlreadyPresent = await Movie.findOne({ movieName: movie.movieName, theatreName: movie.theatreName });
        // console.log(isMovieAlreadyPresent._id == movieId)
        if (isMovieAlreadyPresent && isMovieAlreadyPresent._id != movieId) {
            return { status: 400, message: "Movie Already Present" };
        }

        let updatedMovie = await Movie.findByIdAndUpdate(movieId, movie, { new: true });

        return { status: 200, message: "Movie updated successfully", movie: updatedMovie };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}
