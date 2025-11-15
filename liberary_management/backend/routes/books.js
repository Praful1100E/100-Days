const express = require('express');
const Book = require('../models/Book');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add book (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  const { title, author, isbn, category, totalCopies, publishedYear } = req.body;
  try {
    const book = new Book({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies: totalCopies,
      publishedYear
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update book (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete book (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
