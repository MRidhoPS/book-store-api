const { createTransaction, createTransactionItem, historyTransactionModels } = require('../models/transaction_models');

async function buyBooksController(req, res) {
    const { user_id, bayar, items } = req.body;

    if (!user_id || !bayar || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    let total = 0;

    for (let item of items) {
        if (!item.id || !item.price || !item.quantity) {
            return res.status(400).json({ message: 'Item tidak lengkap' });
        }
        total += parseFloat(item.price) * item.quantity;
    }

    const kembalian = bayar - total;

    try {
        const transactionId = await createTransaction(user_id, bayar, kembalian);
        
        for (let item of items) {
            await createTransactionItem(transactionId, item.id, item.quantity, item.price);
        }

        res.status(201).json({
            message: 'Transaksi berhasil',
            total,
            bayar,
            kembalian,
            transaction_id: transactionId,
            items
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function transactionHistoryController(req, res) {
    try {
        const resHistory = await historyTransactionModels();

        if (resHistory.length === 0) return res.json(404).json({ message: "History Kosong" });

        return res.status(200).json({ message: "History berhasil di dapatkan", data: resHistory });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    buyBooksController,
    transactionHistoryController
};
