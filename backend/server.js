const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Online Library Management System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Online Library Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      health: '/api/health'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Online Library Management System API`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
