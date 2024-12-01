import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../../services/bookService';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/global.css';

const CreateBook = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImage: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

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
    setIsLoading(true);

    // Basic validation
    if (!formData.title || !formData.author || !formData.genre || !formData.description) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      // If no cover image is provided, use default
      const bookData = {
        ...formData,
        coverImage: formData.coverImage || process.env.REACT_APP_DEFAULT_BOOK_COVER
      };

      await createBook(bookData);
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Failed to create book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-book-container">
      <div className="create-book-content">
        <h2>Add New Book</h2>
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
              value={formData.genre}
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
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBook; 