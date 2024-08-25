const router = require('express').Router();
const { bookTicket, updateAllotedTickets } = require("../controllers/ticketController");
const authMiddleware = require('../utils/authMiddleware')
const adminRoleMiddleware = require('../utils/adminRoleMiddleware');

// book ticket : post
router.post('/:movieName/add', authMiddleware, bookTicket);

// update alloted tickets for a particular movie/theatre : put
router.put('/:movieName/update/:ticket', authMiddleware, adminRoleMiddleware, updateAllotedTickets);


module.exports = router;