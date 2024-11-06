const { bookTicketService, updateAllotedTicketsService } = require("../services/ticketService");

module.exports.bookTicket = async (req, res) => {
    const { movieName } = req.params;
    const ticketDetails = req.body;
    console.log(ticketDetails)
    const response = await bookTicketService(movieName, ticketDetails);
    res.status(response.status).json(response);
}

module.exports.updateAllotedTickets = async (req, res) => {
    const { movieName, ticket } = req.params;
    const { theatreName } = req.body;
    const response = await updateAllotedTicketsService(movieName, ticket, theatreName);
    res.status(response.status).json(response);
}