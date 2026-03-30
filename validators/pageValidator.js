const validator = require('validator');

function validateSlug(slug) {
    return validator.isSlug(slug);
}

module.exports = { validateSlug }