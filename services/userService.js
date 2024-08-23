const { hashPassword, comparePassword, generateToken } = require('../utils/auth')
const User = require('../models/userModel');

module.exports.registerUserService = async (user) => {
    try {
        // validation
        // check email is unique or not
        const isEmailAlreadyPresent = await User.findOne({ email: user.email });
        if (isEmailAlreadyPresent) {
            return { status: 400, error: "Email is already present" }
        }

        // check whehter password and confirm password are same or not
        let isPasswordMatching = (user.password === user.confirmPassword);
        if (!isPasswordMatching) {
            return { status: 400, error: 'Passwords are not matching' };
        }

        // hash
        let hashedPassword = hashPassword(user.password);

        const newUser = new User({ ...user, password: hashedPassword });
        const savedUser = await newUser.save();
        return { status: 201, message: "User successfully registered" };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' }
    }
}

module.exports.loginUserService = async (email, password) => {
    try {

        // validation

        // check whether email is valid or not
        const user = await User.findOne({ email });
        if (!user) {
            return { status: 400, message: "Invalid Credentials" };
        }

        // check whether password is valid or not
        let isPasswordMatching = comparePassword(password, user.password);
        if (!isPasswordMatching) {
            return { status: 400, message: "Invalid Credentials" }
        }

        const userDetails = await User.findOne({ email }).select('firstName lastName email phoneNumber role')
        // generate token
        const token = generateToken(userDetails);
        return { status: 200, data: { token, user: userDetails }, message: `${user.firstName} logged in successfully` }
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' }
    }
}

module.exports.forgotPasswordService = async (email, password, confirmPassword) => {
    try {

        // check email
        const user = await User.findOne({ email });
        if (!user) {
            return { status: 400, message: "Invalid Credentials" };
        }

        // match password
        if (password !== confirmPassword) {
            return { status: 400, message: "Passwords are not matching" }
        }

        // hash the password
        let hashedPassword = hashPassword(password);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        return { status: 200, message: "Password successfully updated" };
    }
    catch (err) {
        console.error(err);
        return { status: 500, err: 'Internal Server Error' }
    }
}

