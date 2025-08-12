const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connected to MySQL database');
        connection.release();
    } catch (err) {
        console.error('Database connection failed: ' + err.stack);
    }
})();

module.exports = db;
