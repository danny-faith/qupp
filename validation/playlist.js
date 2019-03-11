const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.slug = !isEmpty(data.slug) ? data.slug : '';

    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Playlist name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Playlist name field is required';
    }

    if (!Validator.isAlpha(data.slug)) {
        errors.slug = 'Please do not use special characters';
    }

    if (!Validator.isLowercase(data.slug)) {
        errors.slug = 'Please make sure slug is all lowercase';
    }

    if (!Validator.isLength(data.slug, { min: 2, max: 40 })) {
        errors.slug = 'Playlist slug must be between 2 and 40 characters';
    }

    if (Validator.isEmpty(data.slug)) {
        errors.slug = 'Playlist slug field is required';
    }
       
    return {
        errors,
        isValid: isEmpty(errors)
    };
}