const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employee_routes');

dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Mengizinkan semua metode HTTP
    allowedHeaders: ['Content-Type', 'Authorization'] // Mengizinkan header yang diperlukan
}));
app.use(express.json());

// ROUTES
app.use('/api/bookstore', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

