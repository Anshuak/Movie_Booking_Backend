const { bookTicketService, updateAllotedTicketsService, getAllTicketsService, getMyTicketsService } = require("../services/ticketService");

module.exports.bookTicket = async (req, res) => {
    const { movieName } = req.params;
    const ticketDetails = req.body;
    ticketDetails.numberOfBookedTickets = +ticketDetails.numberOfBookedTickets;
    console.log(movieName, ticketDetails)
    const response = await bookTicketService(movieName, ticketDetails);
    res.status(response.status).json(response);
}

module.exports.updateAllotedTickets = async (req, res) => {

    const { movieName, ticket } = req.params;
    const { theatreName } = req.body;
    const response = await updateAllotedTicketsService(movieName, ticket, theatreName);
    res.status(response.status).json(response);
}

module.exports.getAllTickets = async (req, res) => {

    const response = await getAllTicketsService();
    res.status(response.status).json(response);
}

module.exports.getMyTickets = async (req, res) => {
    const { userId } = req.params;
    console.log('here')
    const response = await getMyTicketsService(userId);
    res.status(response.status).json(response);
}