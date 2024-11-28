const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Book Recommendation System!');
});

// Define routes for users, books, reviews (we'll add these next)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
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
        const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
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
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create a new book
app.post('/api/books', async (req, res) => {
    const { title, author, genre, description, coverImage, addedBy } = req.body;

    const newBook = new Book({ title, author, genre, description, coverImage, addedBy });
    await newBook.save();

    res.status(201).json(newBook);
});

// Get all books
app.get('/api/books', async (req, res) => {
    const books = await Book.find().populate('addedBy');
    res.json(books);
});
// Create a review for a book
app.post('/api/reviews', async (req, res) => {
    const { bookId, userId, rating, comment } = req.body;

    const newReview = new Review({ bookId, userId, rating, comment });
    await newReview.save();

    res.status(201).json(newReview);
});

// Get reviews for a book
app.get('/api/reviews/:bookId', async (req, res) => {
    const reviews = await Review.find({ bookId: req.params.bookId }).populate('userId');
    res.json(reviews);
});

