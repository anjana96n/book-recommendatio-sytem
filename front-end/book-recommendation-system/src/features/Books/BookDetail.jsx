import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../../services/bookService';
import { createReview, getBookReviews } from '../../services/reviewService';
import { AuthContext } from '../../context/AuthContext';
import StarRating from './StarRating';
import '../../assets/styles/global.css';

const BookDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const [bookData, reviewsData] = await Promise.all([
          getBookById(bookId),
          getBookReviews(bookId)
        ]);
        setBook(bookData);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load book details');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && bookId) {
      fetchBookAndReviews();
    }
  }, [bookId, isLoggedIn]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.rating) {
      setError('Please select a rating');
      return;
    }

    try {
      const reviewData = {
        bookId,
        rating: newReview.rating,
        comment: newReview.comment
      };

      const createdReview = await createReview(reviewData);
      setReviews([...reviews, createdReview]);
      setNewReview({ rating: 0, comment: '' });
      setError('');
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!book) return <div className="error-message">Book not found</div>;

  return (
    <div className="book-detail-container">
      <div className="book-detail-content">
        <div className="book-detail-header">
          <button onClick={() => navigate('/books')} className="back-button">
            <i className="fas fa-arrow-left"></i> Back to Books
          </button>
        </div>

        <div className="book-detail-main">
          <div className="book-cover-section">
            <img 
              src={book.coverImage || process.env.REACT_APP_DEFAULT_BOOK_COVER}
              alt={book.title}
              className="book-detail-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="book-info-section">
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">By {book.author}</p>
            <span className="book-detail-genre">{book.genre}</span>
            <p className="book-detail-description">{book.description}</p>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          
          <form onSubmit={handleReviewSubmit} className="review-form">
            <div className="rating-input">
              <label>Your Rating:</label>
              <StarRating 
                rating={newReview.rating}
                onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
              />
            </div>
            
            <div className="comment-input">
              <label>Your Review:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Write your review here..."
                rows="4"
              />
            </div>

            <button type="submit" className="submit-review-button">
              Submit Review
            </button>
          </form>

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <StarRating rating={review.rating} readonly />
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 