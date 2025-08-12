const jwtToken = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token tidak ditemukan' });
    }

    try {
        const decoded = jwtToken.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }
}


module.exports = { verifyToken };