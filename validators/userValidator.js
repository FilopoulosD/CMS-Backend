const validator = require('validator');

function validateEmail(email) {
    return validator.isEmail(email);
}

// Password must contain at least 8 characters, 1 uppercase, 1 lowercase and 1 number
function validatePassword(password) {
    return validator.isStrongPassword(password, { minSymbols: 0 })
}

module.exports = { validateEmail, validatePassword }