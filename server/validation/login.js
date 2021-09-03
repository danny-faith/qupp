const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.usernameOrEmail = !isEmpty(data.usernameOrEmail) ? data.usernameOrEmail : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    
    // if (!Validator.isEmail(data.usernameOrEmail)) {
    //     errors.usernameOrEmail = 'Email is invalid';
    // }

    if (Validator.isEmpty(data.usernameOrEmail)) {
        errors.usernameOrEmail = 'Username or email field is required';
    }
    
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}