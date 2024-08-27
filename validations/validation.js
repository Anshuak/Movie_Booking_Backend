const Validator = require('validatorjs');

module.exports.registerUserValidation = (data) => {
    let rules = {
        firstName: "alpha|min:1|required",
        lastName: "alpha|min:2|required",
        email: "email|required",
        phoneNumber: "digits:10|required",
        password: "string|min:8|required",
        confirmPassword: "required|same:password"
    }

    let validation = new Validator(data, rules);
    return validation;
}

module.exports.loginUserValidation = (data) => {

    let rules = {
        email: "email|required",
        password: "string|min:8|required",
    }

    let validation = new Validator(data, rules);
    return validation;
}