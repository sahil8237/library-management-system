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

// Function to generate tags based on book content
const generateTags = (book) => {
  const tags = [];

  // Genre-based tags
  const titleLower = book.title.toLowerCase();
  const authorLower = book.author.toLowerCase();
  const descLower = book.description ? book.description.toLowerCase() : '';

  // Fiction genres
  if (titleLower.includes('harry potter') || authorLower.includes('rowling') || descLower.includes('wizard') || descLower.includes('magic')) {
    tags.push('fantasy', 'young adult', 'magic');
  }
  if (titleLower.includes('hobbit') || authorLower.includes('tolkien') || descLower.includes('fantasy') || descLower.includes('adventure')) {
    tags.push('fantasy', 'adventure', 'epic');
  }
  if (titleLower.includes('great gatsby') || authorLower.includes('fitzgerald') || descLower.includes('jazz age') || descLower.includes('american')) {
    tags.push('classic', 'american literature', 'drama');
  }
  if (titleLower.includes('mockingbird') || authorLower.includes('lee') || descLower.includes('racial') || descLower.includes('injustice')) {
    tags.push('classic', 'american literature', 'social issues');
  }
  if (titleLower.includes('catcher in the rye') || authorLower.includes('salinger') || descLower.includes('teenage') || descLower.includes('rebellion')) {
    tags.push('classic', 'coming of age', 'literary fiction');
  }
  if (titleLower.includes('1984') || authorLower.includes('orwell') || descLower.includes('dystopian') || descLower.includes('totalitarian')) {
    tags.push('dystopian', 'political fiction', 'classic');
  }
  if (titleLower.includes('pride and prejudice') || authorLower.includes('austen') || descLower.includes('romantic') || descLower.includes('manners')) {
    tags.push('romance', 'classic', 'historical fiction');
  }
  if (titleLower.includes('alchemist') || authorLower.includes('coelho') || descLower.includes('philosophical') || descLower.includes('destiny')) {
    tags.push('philosophy', 'inspiration', 'adventure');
  }

  // Non-fiction genres
  if (descLower.includes('physics') || descLower.includes('scientists') || descLower.includes('engineers')) {
    tags.push('science', 'physics', 'textbook');
  }
  if (descLower.includes('calculus') || descLower.includes('mathematics')) {
    tags.push('mathematics', 'calculus', 'textbook');
  }
  if (descLower.includes('biology') || descLower.includes('biological')) {
    tags.push('science', 'biology', 'textbook');
  }
  if (descLower.includes('software') || descLower.includes('programming') || descLower.includes('code')) {
    tags.push('technology', 'programming', 'software development');
  }
  if (descLower.includes('history') || descLower.includes('humankind')) {
    tags.push('history', 'anthropology', 'non-fiction');
  }
  if (descLower.includes('habits') || descLower.includes('success') || descLower.includes('mindset')) {
    tags.push('self-help', 'personal development', 'psychology');
  }
  if (descLower.includes('money') || descLower.includes('finance') || descLower.includes('wealth')) {
    tags.push('finance', 'business', 'personal finance');
  }
  if (descLower.includes('startup') || descLower.includes('entrepreneur') || descLower.includes('innovation')) {
    tags.push('business', 'entrepreneurship', 'startups');
  }

  // Remove duplicates and return
  return [...new Set(tags)];
};

const updateBookTags = async () => {
  try {
    console.log('🏷️ Updating book tags...');

    const books = await Book.find({});

    for (const book of books) {
      const tags = generateTags(book);
      if (tags.length > 0) {
        book.tags = tags;
        await book.save();
        console.log(`✅ Updated tags for "${book.title}": ${tags.join(', ')}`);
      } else {
        console.log(`⚠️ No tags generated for "${book.title}"`);
      }
    }

    console.log('🎉 Book tag updates completed!');
  } catch (error) {
    console.error('❌ Error updating tags:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

// Run the update
updateBookTags();
