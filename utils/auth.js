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
    const token = jwt.sign({ user }, process.env.SECRET_KEY);
    return token;
}

module.exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return false;
        }

        // Add the decoded user information to the request object
        return decoded;

        // Call the next middleware or route handler
    });
}