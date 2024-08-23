const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: false,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxLength: 10,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;