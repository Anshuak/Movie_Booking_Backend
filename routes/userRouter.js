const router = require('express').Router();
const { registerUser, loginUser, forgotPassword } = require('../controllers/userController')
const authMiddleware = require('../utils/authMiddleware')


router.post('/register', registerUser);
// login user : post
router.post('/login', loginUser);

// forgot password :put
router.put('/:email/forgot', authMiddleware, forgotPassword);

module.exports = router;