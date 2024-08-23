const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    numberOfBookedTickets: {
        type: Number,
        required: true,
        min: 1
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    },

    seatNumber: {
        type: [Number],
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;