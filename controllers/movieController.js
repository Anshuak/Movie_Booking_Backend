const { getAllMoviesService, searchMovieByNameService } = require("../services/movieService");

module.exports.getAllMovies = async (req, res) => {
    const response = await getAllMoviesService();
    res.status(response.status).json(response);
}

module.exports.searchMovieByName = async (req, res) => {
    const { movieName } = req.params;
    const response = await searchMovieByNameService(movieName);
    res.status(response.status).json(response);
}