const db = require('../database/db');

async function checkingUser(username) {
    const [result] = await db.query('SELECT * FROM users where username = ?', [username]);

    return result[0];
}

async function registerModels({ username, password }) {

    const [result] = await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, password]);

    return result;

}

async function loginModels({ username}) {
    const [result] = await db.query('SELECT * FROM users where username = ?', [username]);

    return result[0];
}

module.exports = { registerModels, checkingUser, loginModels, }