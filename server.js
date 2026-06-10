const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = `${process.env.MONGODB_URI}${process.env.DB_NAME}`;
    
    if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
      throw new Error('MONGODB_URI and DB_NAME are required in .env file');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB Connection Failed:', error.message);
    console.error('Please check your MongoDB credentials and .env configuration');
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CRUD API for User Management',
    endpoints: {
      'POST /api/auth/signup': 'Register a new user',
      'POST /api/auth/login': 'Login with email and password',
      'POST /api/users': 'Create a new user',
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get a user by ID',
      'PUT /api/users/:id': 'Update a user',
      'DELETE /api/users/:id': 'Delete a user',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
    error: `The endpoint ${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  });
});

// Start server (only in non-serverless environments)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}`);
  });
}

module.exports = app;
