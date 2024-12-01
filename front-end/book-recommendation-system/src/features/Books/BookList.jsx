import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks } from '../../services/bookService';
import { AuthContext } from '../../context/AuthContext';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError('Error fetching books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [isLoggedIn, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="book-list-container">
      <h2>Book List</h2>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div 
              key={book._id} 
              className="book-card"
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <img 
                src={book.coverImage || process.env.REACT_APP_DEFAULT_BOOK_COVER}
                alt={book.title}
                className="book-cover"
                onError={(e) => {
                  e.target.src = process.env.REACT_APP_DEFAULT_BOOK_COVER;
                }}
              />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <span className="genre-tag">{book.genre}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-books-message">No books found</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
