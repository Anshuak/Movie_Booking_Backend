const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    numberOfBookedTickets: {
        type: Number,
        required: true,
        min: 1
    },
    movieName: {
        type: String,
        required: true,
    },
    theatreName: {
        type: String,
        required: true
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
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;