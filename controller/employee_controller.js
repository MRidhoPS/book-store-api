const { showBookModels, addBookModels, checkingBookModels, updateBookModels, deleteBookModels } = require("../models/employee_models");

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

async function updateBookController(req, res) {
    const { id } = req.params;
    let data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ message: "Minimal satu field harus diupdate" });
    }

    if (data.price && typeof data.price === 'string') {
        const cleanedPrice = data.price.replace(/\./g, '');
        if (!/^\d+$/.test(cleanedPrice)) {
            return res.status(400).json({ message: "Format harga tidak valid" });
        }
        data.price = parseFloat(cleanedPrice);
    }

    try {
        const oldData = await checkingBookModels({id});
        if (!oldData) {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }

        const isDifferent = Object.keys(data).some(field => {
            const newVal = data[field];
            const oldVal = oldData[field];
            if (field === 'price') return parseFloat(newVal) !== parseFloat(oldVal);
            return newVal !== oldVal;
        });

        if (!isDifferent) {
            return res.status(400).json({ message: "Tidak ada perubahan data" });
        }

        const result = await updateBookModels(id, data);

        if (result.affectedRows > 0) {
            res.status(200).json({
                message: "Buku berhasil diperbarui",
                updatedFields: data
            });
        } else {
            res.status(500).json({ message: "Gagal memperbarui buku" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteBookController(req, res) {
    const {id} = req.params;

    try {
        const checkRes = await checkingBookModels({id});

        if(!checkRes) return res.status(404).json({message: "Tidak ada buku"});

        await deleteBookModels({id});

        return res.status(200).json({message: "Berhasil delete buku"})
    } catch (error) {
        return res.status(500).json({message: error});
    }
}

module.exports = { showBookController, addBookController, updateBookController, deleteBookController }