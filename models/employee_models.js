const db = require('../database/db');

async function showBookModels() {
    const [result] = await db.query('SELECT * FROM books');

    return result;
}

async function addBookModels({title, price, gambar_url}) {
    const [result] = await db.query('INSERT INTO books (title, price, gambar_url) values (?,?,?)', [title, price, gambar_url]);

    console.log(result);

    return result;
}

module.exports = {showBookModels, addBookModels}