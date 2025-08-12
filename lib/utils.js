const jwt = require('jsonwebtoken');

function generateToken(userId, username, res) {
    const token = jwt.sign({
        userId,
        username,
    },

        process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV !== 'development',
        path: '/',
    });

    return token;
}

module.exports = {
    generateToken
}