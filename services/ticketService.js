const Ticket = require("../models/ticketModel");
const Movie = require("../models/movieModel");

module.exports.bookTicketService = async (movieName, { theatreName, userId, numberOfBookedTickets }) => {
    try {
        // Validation
        if (!movieName || !theatreName || !userId || !numberOfBookedTickets) {
            return { status: 400, message: 'Missing required booking information.' };
        }

        // Fetch all tickets for the specified movie and theatre
        const tickets = await Ticket.find({ movieName, theatreName });
        let ticketsAlreadyBooked = tickets.reduce((total, ticket) => total + ticket.numberOfBookedTickets, 0);

        // Find the movie to get total seats allotted
        const movie = await Movie.findOne({ movieName, theatreName });
        if (!movie) {
            return { status: 404, message: 'Movie or theatre not found.' };
        }

        // Calculate available tickets
        let availableTickets = movie.totalSeatsAlloted - ticketsAlreadyBooked;
        if (numberOfBookedTickets > availableTickets) {
            return {
                status: 400,
                message: `Booking conflict: Requested ${numberOfBookedTickets} tickets but only ${availableTickets} are available.`,
            };
        }

        // Collect all booked seat numbers
        const bookedSeatNumbers = tickets.flatMap(ticket => ticket.seatNumber);
        const seatNumber = [];

        // Assign seat numbers up to the requested count
        for (let i = 1; i <= movie.totalSeatsAlloted; i++) {
            if (!bookedSeatNumbers.includes(i)) {
                seatNumber.push(i);
            }
            if (seatNumber.length === numberOfBookedTickets) break; // Stop when we've assigned enough seats
        }

        // Save the booking details
        const ticket = new Ticket({
            movieName,
            theatreName,
            userId,
            numberOfBookedTickets,
            seatNumber,
        });
        const savedTicket = await ticket.save();

        if (numberOfBookedTickets === availableTickets) {
            const updatedMovie = await Movie.findByIdAndUpdate(
                movie._id,
                { ticketStatus: 'Sold Out!' },
                { new: true }
            );
            console.log(updatedMovie);
        }

        return {
            status: 201,
            message: `${savedTicket.numberOfBookedTickets} Ticket/s successfully booked for the movie "${savedTicket.movieName}" at theatre "${savedTicket.theatreName}".`,
            data: { ticket: savedTicket },
        };
    } catch (err) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
};


module.exports.updateAllotedTicketsService = async (movieName, ticket, theatreName) => {

    try {
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

module.exports.getAllTicketsService = async () => {
    try {
        const tickets = await Ticket.find();
        return { status: 200, data: { tickets } }
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' };
    }
}

module.exports.getMyTicketsService = async (userId) => {
    try {
        // Find tickets for the user
        const tickets = await Ticket.find({ userId }).lean();;

        // Add movie details to each ticket manually
        const ticketsWithMovies = await Promise.all(
            tickets.map(async (ticket) => {
                // Find the movie based on movieName and theatreName
                const movie = await Movie.findOne({
                    movieName: ticket.movieName,
                    theatreName: ticket.theatreName
                })

                // Merge movie details with the ticket data
                return {
                    ...ticket, movie
                };
            })
        );

        return { status: 200, data: { tickets: ticketsWithMovies } };
    } catch (err) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
};