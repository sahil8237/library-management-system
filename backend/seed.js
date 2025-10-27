const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@library.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'Library Admin',
      email: 'admin@library.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

const seedBooks = async () => {
  try {
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        description: 'A classic American novel set in the Jazz Age.',
        publishedYear: 1925,
        pages: 180,
        totalCopies: 5,
        coverImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        description: 'A gripping tale of racial injustice and childhood innocence.',
        publishedYear: 1960,
        pages: 376,
        totalCopies: 3,
        coverImage: 'https://m.media-amazon.com/images/I/81gkyAx5-RL._AC_UF1000,1000_QL80_.jpg'
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        description: 'A dystopian social science fiction novel.',
        publishedYear: 1949,
        pages: 328,
        totalCopies: 4,
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg'
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '9780486284736',
        description: 'A romantic novel of manners.',
        publishedYear: 1813,
        pages: 279,
        totalCopies: 6,
        coverImage: 'https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg'
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '9780316769488',
        description: 'A controversial novel about teenage rebellion.',
        publishedYear: 1951,
        pages: 277,
        totalCopies: 2,
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/3/32/Rye_catcher.jpg'
      },
      {
        title: 'Physics for Scientists and Engineers',
        author: 'Paul A. Tipler, Gene Mosca',
        isbn: '9781429201247',
        description: 'A comprehensive physics textbook for science and engineering students.',
        publishedYear: 2007,
        pages: 1200,
        totalCopies: 5,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51X8Q8Q8Q8L._SX376_BO1,204,203,200_.jpg'
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        description: 'A guide to writing clean, maintainable code.',
        publishedYear: 2008,
        pages: 464,
        totalCopies: 3,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL._SX376_BO1,204,203,200_.jpg'
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        description: 'An exploration of the history of humankind from the Stone Age to the modern age.',
        publishedYear: 2014,
        pages: 443,
        totalCopies: 4,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51Sn8PEXwcL._SX376_BO1,204,203,200_.jpg'
      },
      {
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        isbn: '9781285741550',
        description: 'A comprehensive calculus textbook covering early transcendentals.',
        publishedYear: 2015,
        pages: 1368,
        totalCopies: 2,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51X8Q8Q8Q8L._SX376_BO1,204,203,200_.jpg'
      },
      {
        title: 'Biology',
        author: 'Peter H. Raven',
        isbn: '9781260565955',
        description: 'A comprehensive biology textbook covering all major biological concepts.',
        publishedYear: 2019,
        pages: 1408,
        totalCopies: 6,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51X8Q8Q8Q8L._SX376_BO1,204,203,200_.jpg'
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        isbn: '9780061122415',
        description: 'A philosophical story about following your dreams and destiny.',
        publishedYear: 1988,
        pages: 208,
        totalCopies: 4,
        coverImage: 'https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg'
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '9780547928227',
        description: 'A fantasy adventure story preceding The Lord of the Rings.',
        publishedYear: 1937,
        pages: 310,
        totalCopies: 5,
        coverImage: 'https://m.media-amazon.com/images/I/91b0C2YNSrL.jpg'
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        description: 'An easy and proven way to build good habits and break bad ones.',
        publishedYear: 2018,
        pages: 320,
        totalCopies: 3,
        coverImage: 'https://m.media-amazon.com/images/I/91bYsX41DVL.jpg'
      },
      {
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        isbn: '9781612680194',
        description: 'A personal finance book that challenges conventional views on money.',
        publishedYear: 1997,
        pages: 336,
        totalCopies: 6,
        coverImage: 'https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg'
      },
      {
        title: 'Think and Grow Rich',
        author: 'Napoleon Hill',
        isbn: '9781585424337',
        description: 'A timeless self-help book focused on success principles and mindset.',
        publishedYear: 1937,
        pages: 238,
        totalCopies: 5,
        coverImage: 'https://m.media-amazon.com/images/I/71UypkUjStL.jpg'
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        isbn: '9789390166268',
        description: 'Timeless lessons on wealth, greed, and happiness.',
        publishedYear: 2020,
        pages: 252,
        totalCopies: 4,
        coverImage: 'https://m.media-amazon.com/images/I/81Lb75rUhLL.jpg'
      },
      {
        title: 'The Subtle Art of Not Giving a F*ck',
        author: 'Mark Manson',
        isbn: '9780062457714',
        description: 'A counterintuitive approach to living a good life.',
        publishedYear: 2016,
        pages: 224,
        totalCopies: 3,
        coverImage: 'https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg'
      },
      {
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen R. Covey',
        isbn: '9780743269513',
        description: 'Powerful lessons in personal change and effectiveness.',
        publishedYear: 1989,
        pages: 381,
        totalCopies: 4,
        coverImage: 'https://m.media-amazon.com/images/I/71tbalAHYCL.jpg'
      },
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        isbn: '9780590353427',
        description: 'The first book in the legendary Harry Potter series.',
        publishedYear: 1997,
        pages: 309,
        totalCopies: 7,
        coverImage: 'https://m.media-amazon.com/images/I/81YOuOGFCJL.jpg'
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        isbn: '9780307887894',
        description: 'How today’s entrepreneurs use continuous innovation to create success.',
        publishedYear: 2011,
        pages: 336,
        totalCopies: 3,
        coverImage: 'https://m.media-amazon.com/images/I/81-QB7nDh4L.jpg'
      }
    ];

    for (const bookData of books) {
      const existingBook = await Book.findOne({ isbn: bookData.isbn });
      if (!existingBook) {
        await Book.create(bookData);
        console.log(`📚 Book "${bookData.title}" created`);
      } else {
        console.log(`⚠️ Book "${bookData.title}" already exists`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding books:', error);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await seedAdmin();
    await seedBooks();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

// Run the seeding
seedDatabase();
