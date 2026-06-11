const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: 'name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: 'Password must be at least 6 characters',
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email Already Exists',
        error: `The email address ${email} is already registered`,
      });
    }

    const user = await User.create({ name, name: name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: 'Signup failed. Please try again later.',
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Credentials',
        error: 'Email or password is incorrect',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Credentials',
        error: 'Email or password is incorrect',
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login Successful',
      token,
      data: {
        _id: user._id,
        name: user.name || user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: 'Login failed. Please try again later.',
    });
  }
};
