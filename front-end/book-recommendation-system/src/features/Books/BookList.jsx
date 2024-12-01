import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, deleteBook } from '../../services/bookService';
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

  const handleEditBook = (bookId, e) => {
    e.stopPropagation();
    navigate(`/edit-book/${bookId}`);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter(book => book._id !== bookId));
      } catch (err) {
        setError('Error deleting book');
      }
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="book-list-page">
      <div className="book-list-header">
        <h2>Discover Books</h2>
        <button onClick={() => navigate('/create-book')} className="add-book-btn">
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
                <div className="book-actions">
                  <button onClick={(e) => handleEditBook(book._id, e)} className="edit-button">Edit</button>
                  <button onClick={() => handleDeleteBook(book._id)} className="delete-button">Delete</button>
                </div>
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
