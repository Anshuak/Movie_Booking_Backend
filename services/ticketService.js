const Ticket = require("../models/ticketModel");
const Movie = require("../models/movieModel");
const { sendMessage } = require('../kafka/kafkaProducer');
const { bookTicketValidation } =  require("../validations/validation.js");


module.exports.bookTicketService = async (movieName, { theatreName, userId, numberOfBookedTickets }) => {
    try {
        //validation
        
        let validation = bookTicketValidation({theatreName, userId, numberOfBookedTickets});
        if (validation.fails()) {
            return { status: 400, message: "Invalid", errors: validation.errors.all() };
        }
        
        // check tickets are available or not
        // check how many tickets are already booked for particular movie/theatre
        let ticketsAlreadyBooked = 0;
        const tickets = await Ticket.find({ movieName, theatreName }); // Fetch all tickets

        for (const ticket of tickets) {
            ticketsAlreadyBooked += ticket.numberOfBookedTickets;
        }

        // slots Alloted for particlular movie/theatre
        let movie = await Movie.findOne({ movieName, theatreName });

        // check numberofBookedTickets are available or not
        let availableTickets = movie.totalSeatsAlloted - ticketsAlreadyBooked;
        if (numberOfBookedTickets > availableTickets) {
            return { status: 400, message: `Booking conflict: Requested ${numberOfBookedTickets} tickets but only ${availableTickets} are available.` }
        }
        const bookedSeatNumbers = tickets.flatMap(ticket => ticket.seatNumber);

        // assign seat number
        const seatNumber = [];
        for (let i = 1; i <= movie.totalSeatsAlloted; i++) {
            if (!bookedSeatNumbers.includes(i)) {
                seatNumber.push(i);
            }
            if (seatNumber.length === numberOfBookedTickets) {
                break;
            }
        }


        const ticket = new Ticket({
            movieName,
            theatreName,
            userId,
            numberOfBookedTickets,
            seatNumber
        })
        const savedTicket = await ticket.save();

        // send kafka producer message
        await sendMessage('ticket-booked', JSON.stringify({ movieName: savedTicket.movieName, theatreName: savedTicket.theatreName }));

        return {
            status: 201, message: `${savedTicket.numberOfBookedTickets} Ticket/s Successfully booked of movie ${savedTicket.movieName} at theatre ${savedTicket.theatreName}`, data: { ticket: savedTicket }
        }
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}

// updates theatre capacity tickets via admin
module.exports.updateAllotedTicketsService = async (movieName, ticket, theatreName) => {

    try {
        // validation


        // number of bookedTickets for a particular movie/theatre
        let ticketsAlreadyBooked = 0;
        const tickets = await Ticket.find({ movieName, theatreName }); // Fetch all tickets

        for (const ticket of tickets) {
            ticketsAlreadyBooked += ticket.numberOfBookedTickets;
        }

        // check ticket need to be updated is less than ticketsAlreadyBooked
        if (ticket < ticketsAlreadyBooked) {
            return { status: 400, message: "Updated number of tickets can't than the already booked tickets" }
        }

        // update ticket
        let updatedMovie = await Movie.findOneAndUpdate({ movieName, theatreName }, { totalSeatsAlloted: ticket }, { new: true });

        return { status: 200, message: "ticket slots updated!", data: { movie: updatedMovie } }
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }

}