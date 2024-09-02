const router = require('express').Router();
const { getAllMovies, searchMovieByName, deleteMovie } = require('../controllers/movieController');
const authMiddleware = require("../utils/authMiddleware");
const adminRoleMiddleware = require("../utils/adminRoleMiddleware");

// get all movies with swagger

/**
 * @swagger
 * /api/v1.0/moviebooking/all:
 *   get:
 *     summary: Retrieve a list of all movies
 *     description: Fetch a list of all movies available in the database, including only the movie name and banner.
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   movieName:
 *                     type: string
 *                     description: The name of the movie
 *                     example: Inception
 *                   movieBanner:
 *                     type: string
 *                     description: URL of the movie banner
 *                     example: https://example.com/banners/inception.jpg
 *       500:
 *         description: Server error
 */
router.get('/all', getAllMovies);



// api to get movie by full or partial name
router.get('/movies/search/:movieName', searchMovieByName);
// last api to delete movie, if no tickets booked for the same
router.delete('/:movieName/delete/:userId', authMiddleware, adminRoleMiddleware, deleteMovie);

module.exports = router;