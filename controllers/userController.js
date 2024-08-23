const { registerUserService, loginUserService } = require('../services/userService')

module.exports.registerUser = async (req, res) => {
    const user = req.body;
    const response = await registerUserService(user);
    res.status(response.status).json(response);
}

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const response = await loginUserService(email, password);
    res.status(response.status).json(response);
}

