const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/employee_middleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../database/cloudinary');
const { registerController } = require('../controller/auth_controller');

const router = express.Router();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book-store', 
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({ storage });

router.get('/showBook', authenticateToken, (req, res) => {
    db.query('SELECT * FROM books', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(400).json({ message: 'Buku belum ada' });

        res.status(200).json({
            message: "Berhasil dapat data",
            data: result
        });
    })
})

router.post('/addBook', authenticateToken, upload.single('gambar'), (req, res) => {
    const { title, price } = req.body;

    const gambarUrl = req.file ? req.file.path : null;

    if (!title || !price) {
        return res.status(400).json({ message: "Title dan price wajib diisi" });
    }

    if (typeof price !== 'string') {
        return res.status(400).json({ message: "Harga harus berupa string" });
    }

    const formattedPrice = parseFloat(
        price.replace(/\./g, '').replace(/,/g, '')
    );

    db.query('INSERT INTO books (title, price, gambar_url) values (?,?,?)', [title, formattedPrice, gambarUrl], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: "Buku berhasil terdaftar",
            title,
            price,
            gambarUrl,
        });
    });
});


router.put('/updateBook/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    let data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ message: "Minimal satu field harus diupdate" });
    }

    // Konversi harga jika dikirim dalam format string "80.000"
    if (data.price && typeof data.price === 'string') {
        const cleanedPrice = data.price.replace(/\./g, ''); // hilangkan titik
        if (!/^\d+$/.test(cleanedPrice)) {
            return res.status(400).json({ message: "Format harga tidak valid" });
        }
        data.price = parseFloat(cleanedPrice); // ubah ke number
    }

    db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }

        const oldData = results[0];

        const isDifferent = Object.keys(data).some(field => {
            const newVal = data[field];
            const oldVal = oldData[field];

            if (field === 'price') return parseFloat(newVal) !== parseFloat(oldVal);
            return newVal !== oldVal;
        });

        if (!isDifferent) {
            return res.status(400).json({ message: "Tidak ada perubahan data" });
        }

        const fields = Object.keys(data).map(field => `${field} = ?`).join(', ');
        const values = Object.values(data);
        values.push(id);

        const query = `UPDATE books SET ${fields} WHERE id = ?`;

        db.query(query, values, (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(200).json({
                message: "Buku berhasil diperbarui",
                updatedFields: data,
            });
        });
    });
});

router.delete('/deleteBook/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Hapus dulu dari transaction_items
    db.query('DELETE FROM transaction_items WHERE book_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Baru hapus dari books
        db.query('DELETE FROM books WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(200).json({
                message: `Berhasil Menghapus buku dengan id ${id}`
            });
        });
    });
});


router.post('/buyBooks', authenticateToken, (req, res) => {
    const { user_id, bayar, items } = req.body;

    if (!user_id || !bayar || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    let total = 0;

    items.forEach(item => {
        if (!item.id || !item.price || !item.quantity) {
            return res.status(400).json({ message: 'Item tidak lengkap' });
        }
        total += parseFloat(item.price) * item.quantity;
    });

    const kembalian = bayar - total;

    // Insert ke tabel transactions utama (hanya 1x untuk 1 transaksi)
    const mainTransactionQuery = `
        INSERT INTO transactions (user_id, bayar, kembalian)
        VALUES (?, ?, ?)
    `;

    db.query(mainTransactionQuery, [user_id, bayar, kembalian], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const transactionId = result.insertId; // ID transaksi utama

        // Sekarang insert ke transaction_items
        const itemInserts = items.map(item => {
            return new Promise((resolve, reject) => {
                const insertItemQuery = `
                    INSERT INTO transaction_items (transaction_id, book_id, quantity, price)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(insertItemQuery, [transactionId, item.id, item.quantity, item.price], (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });

        Promise.all(itemInserts)
            .then(() => {
                res.status(201).json({
                    message: 'Transaksi berhasil',
                    total,
                    bayar,
                    kembalian,
                    transaction_id: transactionId,
                    items
                });
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    });
});

router.get('/getHistoryBarang', authenticateToken, (req, res)=>{
    db.query('select * from transaction_items', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(400).json({ message: 'Buku belum ada' });

        res.status(200).json({
            message: "Berhasil dapat data",
            data: result
        });
    })
});







module.exports = router;