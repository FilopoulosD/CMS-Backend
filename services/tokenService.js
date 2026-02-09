const jwt = require('jsonwebtoken');

function generateJWToken(user) {
    return jwt.sign(
        {
            id: user.id, role: user.role
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    )
}
module.exports = { generateJWToken };