const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: 'Name and email are required fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email Already Exists',
        error: `The email address ${email} is already registered in the system`,
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: 'User Created Successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        address: user.address || null,
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
      error: 'Failed to create user. Please try again later.',
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No Users Found',
        count: 0,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Users Retrieved Successfully',
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: 'Failed to retrieve users. Please try again later.',
    });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID',
        error: 'The provided user ID is not valid',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
        error: `No user found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Retrieved Successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: 'Failed to retrieve user. Please try again later.',
    });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID',
        error: 'The provided user ID is not valid',
      });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
        error: `No user found with ID: ${id}`,
      });
    }

    // Check if email is being changed and is unique
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email Already Exists',
          error: `The email address ${email} is already registered in the system`,
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'User Updated Successfully',
      data: updatedUser,
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
      error: 'Failed to update user. Please try again later.',
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID',
        error: 'The provided user ID is not valid',
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
        error: `No user found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User Deleted Successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: 'Failed to delete user. Please try again later.',
    });
  }
};
