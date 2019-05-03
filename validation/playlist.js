const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    
    // only allow lowercase alpha, underscore and hypen/dash
    const regex = new RegExp('[^a-z0-9_-]');
    data.name = !isEmpty(data.name) ? data.name : '';
    data.slug = !isEmpty(data.slug) ? data.slug : '';

    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Playlist name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Playlist name field is required';
    }

    if (regex.test(data.slug)) {
        errors.slug = 'Lowercase letters, numbers, _ and - only';
    }

    if (Validator.isEmpty(data.slug)) {
        errors.slug = 'Playlist slug field is required';
    }
  
    return {
        errors,
        isValid: isEmpty(errors)
    };
}