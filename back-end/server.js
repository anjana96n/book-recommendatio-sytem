const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Book = require('./models/book');
const Review = require('./models/review'); // Import Review model
require('dotenv').config(); // Add dotenv to load environment variables

const app = express();

// Enable CORS with specific configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from your frontend
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/book-recommendation';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Add this middleware function at the top after your imports
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Book Recommendation System!');
});

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Create a new book
app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const { title, author, genre, description, coverImage } = req.body;
    
    // Create new book with addedBy from authenticated user
    const newBook = new Book({
      title,
      author,
      genre,
      description,
      coverImage: coverImage || '',
      addedBy: req.user.userId  // Get user ID from authenticated token
    });

    const savedBook = await newBook.save();
    
    // Populate the addedBy field before sending response
    const populatedBook = await Book.findById(savedBook._id)
      .populate('addedBy', 'username');
    
    res.status(201).json(populatedBook);
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
});

// Get all books
app.get('/api/books', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find().populate('addedBy', 'username');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// Get book by ID
app.get('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    // Add error handling for invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'username')
      .select('title author genre description coverImage addedBy createdAt');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ message: 'Error fetching book details', error: err.message });
  }
});

// Create a review for a book
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const newReview = new Review({
      bookId,
      userId: req.user.userId,
      rating,
      comment,
      createdAt: new Date()
    });

    await newReview.save();

    // Populate user information before sending response
    const populatedReview = await Review.findById(newReview._id)
      .populate('userId', 'username');

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
});

// Get reviews for a book
app.get('/api/reviews/:bookId', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const reviews = await Review.find({ bookId: req.params.bookId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
