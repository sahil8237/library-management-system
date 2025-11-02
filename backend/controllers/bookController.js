const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    let query = { isActive: true };

    // Filtering
    const { author, search, status } = req.query;

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    if (search) {
      // Check if search term looks like an ISBN (numeric, at least 4 digits)
      const cleanSearch = search.replace(/[-\s]/g, '');
      const numericRegex = /^\d{4,}$/;
      if (numericRegex.test(cleanSearch)) {
        // Search by ISBN - match from start or end (first/last digits)
        query.isbn = { $regex: `^${cleanSearch}|${cleanSearch}$`, $options: 'i' };
      } else {
        // Text search for title, author, description
        query.$text = { $search: search };
      }
    }

    if (status) {
      query.status = status;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      sort = sortBy;
    } else {
      sort = '-createdAt';
    }

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    // Pagination result
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Increment view count
    book.viewCount += 1;
    await book.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Public
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload book cover
// @route   PUT /api/books/:id/cover
// @access  Public
exports.uploadBookCover = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    book.coverImage = `/uploads/${req.file.filename}`;
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Cover image uploaded successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recently added books
// @route   GET /api/books/recent
// @access  Public
exports.getRecentBooks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const books = await Book.find({ isActive: true })
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar books based on tags
// @route   GET /api/books/:id/similar
// @access  Public
exports.getSimilarBooks = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const limit = parseInt(req.query.limit, 10) || 6;

    // Find books with matching tags, excluding the current book
    const similarBooks = await Book.find({
      _id: { $ne: book._id },
      isActive: true,
      tags: { $in: book.tags }
    })
    .limit(limit)
    .sort('-viewCount'); // Sort by popularity

    res.status(200).json({
      success: true,
      count: similarBooks.length,
      data: similarBooks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data for admin dashboard
// @route   GET /api/books/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res, next) => {
  try {
    // Top 5 most viewed books
    const topViewedBooks = await Book.find({ isActive: true })
      .sort('-viewCount')
      .limit(5)
      .select('title author viewCount coverImage');

    // Popular genres (tags) with book counts
    const genreStats = await Book.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly book additions for the last 12 months
    const monthlyStats = await Book.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Total books count
    const totalBooks = await Book.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        topViewedBooks,
        genreStats,
        monthlyStats,
        totalBooks
      }
    });
  } catch (error) {
    next(error);
  }
};
