import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1,
    publishedYear: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/books', newBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewBook({ title: '', author: '', isbn: '', category: '', totalCopies: 1, publishedYear: '' });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding book');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Library Management System</h1>
      <p>Welcome, {user.name} ({user.role})</p>
      <button onClick={onLogout} style={{ marginBottom: '20px' }}>Logout</button>

      {user.role === 'admin' && (
        <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
          <h2>Add New Book</h2>
          <form onSubmit={handleAddBook}>
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
              style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
              style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
            />
            <input
              type="text"
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              required
              style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Category"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              required
              style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
            />
            <input
              type="number"
              placeholder="Total Copies"
              value={newBook.totalCopies}
              onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value) })}
              required
              style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
            />
            <input
              type="number"
              placeholder="Published Year"
              value={newBook.publishedYear}
              onChange={(e) => setNewBook({ ...newBook, publishedYear: parseInt(e.target.value) })}
              style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
            />
            <button type="submit" style={{ padding: '10px 20px' }}>Add Book</button>
          </form>
        </div>
      )}

      <h2>Books</h2>
      <ul>
        {books.map(book => (
          <li key={book._id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #eee' }}>
            <strong>{book.title}</strong> by {book.author} (ISBN: {book.isbn}) - {book.availableCopies}/{book.totalCopies} available
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
