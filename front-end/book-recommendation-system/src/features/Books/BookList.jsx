import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks } from '../../services/bookService';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/global.css';

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

  const handleAddBook = () => {
    navigate('/create-book');
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="book-list-page">
      <div className="book-list-header">
        <h2>Discover Books</h2>
        <button onClick={handleAddBook} className="add-book-btn">
          <i className="fas fa-plus"></i> Add New Book
        </button>
      </div>

      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div 
              key={book._id} 
              className="book-card"
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <div className="book-card-image">
                <img 
                  src={book.coverImage || process.env.REACT_APP_DEFAULT_BOOK_COVER}
                  alt={book.title}
                  className="book-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">By {book.author}</p>
                <span className="book-genre">{book.genre}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-books-message">
            <i className="fas fa-books"></i>
            <p>No books found. Add some books to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
