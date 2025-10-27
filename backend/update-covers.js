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

const updateBookCovers = async () => {
  try {
    console.log('🖼️ Updating book covers...');

    const coverUpdates = [
      {
        title: 'The Great Gatsby',
        coverImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg'
      },
      {
        title: 'To Kill a Mockingbird',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/4/4c/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg'
      },
      {
        title: '1984',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg'
      },
      {
        title: 'Pride and Prejudice',
        coverImage: 'https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg'
      },
      {
        title: 'The Catcher in the Rye',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/3/32/Rye_catcher.jpg'
      }
    ];

    for (const update of coverUpdates) {
      const book = await Book.findOne({ title: update.title });
      if (book) {
        book.coverImage = update.coverImage;
        await book.save();
        console.log(`✅ Updated cover for "${update.title}"`);
      } else {
        console.log(`❌ Book "${update.title}" not found`);
      }
    }

    console.log('🎉 Book cover updates completed!');
  } catch (error) {
    console.error('❌ Error updating covers:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

// Run the update
updateBookCovers();
