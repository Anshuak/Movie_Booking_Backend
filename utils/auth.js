const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

module.exports.hashPassword = (password) => {
    const salt = 12;
    let hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}

module.exports.comparePassword = (password, hashedPassword) => {
    let isPasswordMatching = bcrypt.compareSync(password, hashedPassword);
    return isPasswordMatching;
}


module.exports.generateToken = (user) => {
    console.log(user);
    const token = jwt.sign({ user }, process.env.SECRET_KEY);
    return token;
}