import React, { useEffect, useState } from 'react';
import { getBooks } from '../../services/bookService'; // Import getBooks service
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    if (!token) {
      // Redirect to login if token is missing
      navigate('/login');
    }

    const fetchBooks = async () => {
      try {
        const data = await getBooks(token); // Call the getBooks service
        setBooks(data);
      } catch (err) {
        setError('Error fetching books');
      }
    };

    fetchBooks();
  }, [navigate]);

  return (
    <div>
      <h2>Book List</h2>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {books.length > 0 ? (
          books.map((book) => <li key={book._id}>{book.title}</li>)
        ) : (
          <p>No books found</p>
        )}
      </ul>
    </div>
  );
};

export default BookList;
