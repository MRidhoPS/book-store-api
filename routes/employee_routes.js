const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { authenticateToken, verifyToken } = require('../middleware/employee_middleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../database/cloudinary');
const { registerController } = require('../controller/auth_controller');
const { showBookController, addBookController, updateBookController, deleteBookController } = require('../controller/employee_controller');

const router = express.Router();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.CLOUDINARY_FOLDER,
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({ storage });

router.get('/book', verifyToken, showBookController);

router.post('/book', verifyToken, upload.single('gambar'), addBookController);

router.put('/book/:id', verifyToken, updateBookController);

router.delete('/book/:id', verifyToken, deleteBookController);

module.exports = router;