const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^(?:\d{10}|\d{13})$/, 'Please add a valid ISBN (10 or 13 digits)']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Published year must be valid'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1'],
    max: [5000, 'Pages cannot exceed 5000']
  },
  coverImage: {
    type: String,
    default: null
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please add total copies'],
    min: [0, 'Total copies must be at least 0'],
    default: 1
  },
  availableCopies: {
    type: Number,
    min: [0, 'Available copies cannot be negative'],
    default: function() {
      return this.totalCopies;
    }
  },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'reserved', 'unavailable', 'lost'],
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for availability percentage
bookSchema.virtual('availabilityPercentage').get(function() {
  if (this.totalCopies === 0) return 0;
  return Math.round((this.availableCopies / this.totalCopies) * 100);
});

// Virtual for availability status
bookSchema.virtual('availabilityStatus').get(function() {
  const percentage = this.availabilityPercentage;
  if (percentage === 100) return 'Fully Available';
  if (percentage > 50) return 'Mostly Available';
  if (percentage > 0) return 'Limited Availability';
  return 'Out of Stock';
});

// Virtual for formatted title
bookSchema.virtual('formattedTitle').get(function() {
  return this.title.charAt(0).toUpperCase() + this.title.slice(1);
});

// Index for better query performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ isbn: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ isActive: 1 });

module.exports = mongoose.model('Book', bookSchema);
