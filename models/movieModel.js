const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieName: {
        type: String,
        required: true,
    },
    theatreName: {
        type: String,
        required: true,
    },
    totalSeatsAlloted: {
        type: Number,
        required: true
    },
    ticketStatus: {
        type: String,
        required: true,
        default: "BOOK ASAP"
    },
    movieBanner: {
        type: String,
        required: true,
    },
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;