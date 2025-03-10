const router = require('express').Router();
const { getAllMovies, searchMovieByName, deleteMovie, addMovie, updateMovie } = require('../controllers/movieController');
const authMiddleware = require("../utils/authMiddleware");
const adminRoleMiddleware = require("../utils/adminRoleMiddleware");

// get all movies
router.get('/all', getAllMovies);
router.get('/movies/search/:movieName', searchMovieByName);
router.delete('/movies/:movieId/:userId', authMiddleware, adminRoleMiddleware, deleteMovie);
router.post('/movies/add/:userId', authMiddleware, adminRoleMiddleware, addMovie);
router.put('/movies/:movieId/update/:userId', authMiddleware, adminRoleMiddleware, updateMovie);

module.exports = router;