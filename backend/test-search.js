const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testSearch = async () => {
  try {
    console.log('Testing ISBN search...');

    // Test full ISBN search
    const isbnSearch = await Book.find({ isbn: '9780743273565' });
    console.log('Full ISBN search result:', isbnSearch.length, 'books found');

    // Test partial ISBN search (first 4 digits)
    const partialSearchFirst = await Book.find({ isbn: { $regex: '^9780|9780$', $options: 'i' } });
    console.log('Partial ISBN search (first 4):', partialSearchFirst.length, 'books found');

    // Test partial ISBN search (last 4 digits)
    const partialSearchLast = await Book.find({ isbn: { $regex: '^3565|3565$', $options: 'i' } });
    console.log('Partial ISBN search (last 4):', partialSearchLast.length, 'books found');

    // Test text search
    const textSearch = await Book.find({ $text: { $search: 'Gatsby' } });
    console.log('Text search result:', textSearch.length, 'books found');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testSearch();
