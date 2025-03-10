const router = require('express').Router();
const { registerUser, loginUser, forgotPassword, deleteUser, updateUser } = require('../controllers/userController')
const authMiddleware = require('../utils/authMiddleware')


router.post('/register', registerUser);
// login user : post
router.post('/login', loginUser);

// forgot password :put
router.put('/:email/forgot', authMiddleware, forgotPassword);

// delete user
router.delete("/users/:userId", authMiddleware, deleteUser);

// update user
router.put("/users/:userId", authMiddleware, updateUser);


module.exports = router;