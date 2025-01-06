const { registerUserService, loginUserService, forgotPasswordService, deleteUserService, updateUserService } = require('../services/userService')

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

module.exports.deleteUser = async (req, res) => {
    console.log('here delete')
    const { userId } = req.params;
    const response = await deleteUserService(userId);
    res.status(response.status).json(response);
}

module.exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const user = req.body;
    const response = await updateUserService(userId, user);
    res.status(response.status).json(response);
}

