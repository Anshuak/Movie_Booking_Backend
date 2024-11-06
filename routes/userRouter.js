const router = require('express').Router();
const { registerUser, loginUser, forgotPassword, getMyBookedTickets } = require('../controllers/userController')
const authMiddleware = require('../utils/authMiddleware')


router.post('/register', registerUser);
// login user : post
router.post('/login', loginUser);

// forgot password :put
router.put('/:email/forgot', authMiddleware, forgotPassword);

// user tickets
router.get('/mytickets/:userId', authMiddleware, getMyBookedTickets);

module.exports = router;