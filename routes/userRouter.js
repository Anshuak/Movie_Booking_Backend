const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/userController')

// register user :post
router.post('/register', registerUser);
// login user : post
router.post('/login', loginUser);


module.exports = router;