const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // OPPOSITE NOW -- if data.name is empty (could be undefined etc) then make it an empty String - else set it to itself as it will have been a Strign anyway
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    //  reverse the ternary and add ! if this doesn't work

    if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = 'Username must be between 2 and 30 characters';
    }

    // TODO: username cannot accept special characters and does not throw proper error to be handled

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must be at least 6 characters.';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is required';
    }    

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }
    // console.log('(dev) errors: ', errors);
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
}