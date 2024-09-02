const Validator = require('validatorjs');

// user service
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

module.exports.forgotPasswordValidation = (data) => {
   // console.log(data);

    let rules = {
        email: "email|required",
        password: "string|min:8|required",
        confirmPassword: "required|same:password"
    }

    let validation = new Validator(data, rules);
    return validation;
}

// movie service
module.exports.deleteMovieValidation = (data) => {
 
     let rules = {
         movieName: "string|required",
         theatreName: "string|required"
     }
 
     let validation = new Validator(data, rules);
     return validation;
 }

 // ticket service
 module.exports.bookTicketValidation = (data) => {

    let rules = {
        theatreName: "string|required",
        userId: "string|required",
        numberOfBookedTickets: "integer|required|min:1"
    }

    let validation = new Validator(data, rules);
    return validation;
}