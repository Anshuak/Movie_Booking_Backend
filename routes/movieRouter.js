const router = require('express').Router();
const { getAllMovies, searchMovieByName } = require('../controllers/movieController');

// get all movies
router.get('/all', getAllMovies);
router.get('/movies/search/:movieName', searchMovieByName);

module.exports = router;