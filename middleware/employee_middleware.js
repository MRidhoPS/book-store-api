const jwt = require('jsonwebtoken');
const db = require('../database/db');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token diperlukan' });

    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid' });

        // Ambil user dari database berdasarkan ID di dalam token
        db.query('SELECT id, username FROM users WHERE id = ?', [decoded.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.status(403).json({ message: 'User tidak ditemukan' });
            }

            req.user = {
                id: results[0].id,
                username: results[0].username,
            };

            next();
        });
    });
};


module.exports = { authenticateToken };