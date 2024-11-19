const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { SECRET_KEY } = require('../constants');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, SECRET_KEY);
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
