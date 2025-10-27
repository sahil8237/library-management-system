const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  uploadBookCover,
  getRecentBooks,
  getSimilarBooks,
  getAnalytics
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');
const { upload, validateImageDimensions } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/recent', getRecentBooks);
router.get('/:id', getBook);
router.get('/:id/similar', getSimilarBooks);

// Protected routes for CRUD (admin only)
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

// Protected file upload routes
router.put('/:id/cover', protect, authorize('admin'), upload, validateImageDimensions, uploadBookCover);

// Analytics route (admin only)
router.get('/admin/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
