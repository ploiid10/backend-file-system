const express = require('express');
const { registerUser, loginUser } = require('../utils/user');

const router = express.Router();

router.post('/register', registerUser); // Register new user
router.post('/login', loginUser);       // Login user

module.exports = router;
