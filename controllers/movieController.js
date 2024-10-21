const { getAllMoviesService, searchMovieByNameService, deleteMovieService, addMovieService, updateMovieService } = require("../services/movieService");

module.exports.getAllMovies = async (req, res) => {
    const response = await getAllMoviesService();
    res.status(response.status).json(response);
}

module.exports.searchMovieByName = async (req, res) => {
    const { movieName } = req.params;
    const response = await searchMovieByNameService(movieName);
    res.status(response.status).json(response);
}

module.exports.deleteMovie = async (req, res) => {
    const { movieName } = req.params;
    const { theatreName } = req.body;
    const response = await deleteMovieService(movieName, theatreName);
    res.status(response.status).json(response);
}


module.exports.addMovie = async (req, res) => {
    const movie = req.body;
    const response = await addMovieService(movie);
    res.status(response.status).json(response);
}

module.exports.updateMovie = async (req, res) => {
    const movie = req.body;
    const { movieId } = req.params;
    const response = await updateMovieService(movieId, movie);
    res.status(response.status).json(response);
}