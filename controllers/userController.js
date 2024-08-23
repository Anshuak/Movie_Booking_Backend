const { registerUserService, loginUserService, forgotPasswordService } = require('../services/userService')

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

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.params;
    const { password, confirmPassword } = req.body;
    const response = await forgotPasswordService(email, password, confirmPassword);
    res.status(response.status).json(response);
}

