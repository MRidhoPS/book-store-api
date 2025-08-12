const db = require('../database/db');

async function createTransaction(userId, bayar, kembalian) {
    const sql = `
        INSERT INTO transactions (user_id, bayar, kembalian)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [userId, bayar, kembalian]);
    return result.insertId;
}

async function createTransactionItem(transactionId, bookId, quantity, price) {
    const sql = `
        INSERT INTO transaction_items (transaction_id, book_id, quantity, price)
        VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [transactionId, bookId, quantity, price]);
}

async function historyTransactionModels() {
    const sql = `SELECT * FROM transaction_items`;

    const [result] = await db.query(sql);

    return result;
}

module.exports = {
    createTransaction,
    createTransactionItem,
    historyTransactionModels
};
