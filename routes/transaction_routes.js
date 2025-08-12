const express = require('express');
const { verifyToken } = require('../middleware/employee_middleware');
const { buyBooksController, transactionHistoryController } = require('../controller/transcation_controller');

const router = express.Router();

router.post('/', verifyToken, buyBooksController);

router.get('/', verifyToken, transactionHistoryController);

module.exports = router;
