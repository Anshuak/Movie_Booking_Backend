const router = require('express').Router();
const { getAllMovies, searchMovieByName, deleteMovie } = require('../controllers/movieController');
const authMiddleware = require("../utils/authMiddleware");
const adminRoleMiddleware = require("../utils/adminRoleMiddleware");

// get all movies
router.get('/all', getAllMovies);
router.get('/movies/search/:movieName', searchMovieByName);
router.delete('/:movieName/delete/:userId', authMiddleware, adminRoleMiddleware, deleteMovie);

module.exports = router;