const express = require('express');
const { registerController, loginContoller } = require('../controller/auth_controller');
const { loginLimiter } = require('../lib/rateLimit');

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginLimiter,loginContoller);

module.exports = router;