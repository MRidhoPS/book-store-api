const { showBookModels, addBookModels } = require("../models/employee_models");

async function showBookController(req, res) {
    try {
        const showResults = await showBookModels();

        if (showResults.length < 1) {
            return res.status(404).json({
                message: "Belum ada buku"
            })
        }

        return res.status(200).json({
            data: showResults
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

async function addBookController(req, res) {
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

    try {
        const addRes = await addBookModels({ title, price: formattedPrice, gambar_url: gambarUrl, });

        return res.status(201).json({
            message: "Buku berhasil ditambah",
            title,
            price,
            gambarUrl,
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

module.exports = { showBookController, addBookController }