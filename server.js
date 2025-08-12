const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth_routes');
const adminRoutes = require('./routes/employee_routes');
const transactionRoutes = require('./routes/transaction_routes');
const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use('/bookstore/auth', authRoutes);
app.use('/bookstore/admin', adminRoutes);
app.use('/bookstore/transaction',transactionRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

