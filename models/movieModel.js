const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieName: {
        type: String,
    },
    theatreName: {
        type: String,
    },
    totalSeatsAlloted: {
        type: Number,
    },
    ticketStatus: {
        type: String,
        default: "BOOK ASAP"
    },
    movieBanner: {
        type: String,
    },
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;