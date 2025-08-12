const db = require('../database/db');

async function checkingBookModels({ id }) {
    const [result] = await db.query('SELECT * FROM books WHERE id = ?', [id]);

    return result[0];
}

async function showBookModels() {
    const [result] = await db.query('SELECT * FROM books');

    return result;
}

async function addBookModels({ title, price, gambar_url }) {
    const [result] = await db.query('INSERT INTO books (title, price, gambar_url) values (?,?,?)', [title, price, gambar_url]);

    console.log(result);

    return result;
}

async function updateBookModels(id, params) {
    const fields = Object.keys(params).map(field => `${field} = ?`).join(', ');
    const values = Object.values(params);
    values.push(id);

    const sql = `UPDATE books SET ${fields} WHERE id = ?`;

    const [result] = await db.query(sql, values);
    return result;
}

async function deleteTransactionModels({ id }) {
    const [result] = await db.query('DELETE FROM transaction_items WHERE book_id = ?', [id]);

    return result[0];
}

async function deleteBookModels({id}) {

    await deleteTransactionModels({id});

    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id],);

    return result[0];
}




module.exports = { checkingBookModels, showBookModels, addBookModels, updateBookModels, deleteBookModels }