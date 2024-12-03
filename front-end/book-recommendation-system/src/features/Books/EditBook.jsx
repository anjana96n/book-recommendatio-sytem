import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, updateBook } from '../../services/bookService';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/global.css';

const EditBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImage: '',
    averageRating: 0,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return; // Early return if not logged in
    }

    const fetchBook = async () => {
      try {
        const bookData = await getBookById(bookId);
        setFormData(bookData);
      } catch (err) {
        setError('Failed to load book details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await updateBook(bookId, formData);
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Failed to update book');
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="create-book-container">
      <div className="create-book-content">
        <h2>Edit Book</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-book-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre} // Ensure the genre is set correctly
              onChange={handleChange}
              required
            >
              <option value="">Select a genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL (optional)</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="Enter cover image URL"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/books')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
            >
              Update Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;