import React, { useEffect, useState, useContext } from 'react';
import { getMostRatedBooks, getRecentActivities } from '../../services/bookService';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/global.css';

const Feed = () => {
  const [mostRatedBooks, setMostRatedBooks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState('');
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      return; // Redirect to login if not logged in
    }

    const fetchFeedData = async () => {
      try {
        const [ratedBooks, activities] = await Promise.all([
          getMostRatedBooks(),
          getRecentActivities()
        ]);
        setMostRatedBooks(ratedBooks);
        setRecentActivities(activities);
      } catch (err) {
        console.error('Error fetching feed data:', err);
        setError('Error fetching feed data');
      }
    };

    fetchFeedData();
  }, [isLoggedIn]);

  return (
    <div className="feed-container">
      <h2>Feed</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="most-rated-section">
        <h3>Most Rated Books</h3>
        <div className="books-grid">
          {mostRatedBooks.length > 0 ? (
            mostRatedBooks.map((book) => (
              <div key={book._id} className="book-card">
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
                  <p className="book-rating">Rating: {book.averageRating} / 5</p>
                </div>
              </div>
            ))
          ) : (
            <p>No rated books found.</p>
          )}
        </div>
      </div>

      <div className="recent-activities-section">
        <h3>Recent Activities</h3>
        <ul className="activities-list">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <li key={index} className="activity-item">
                {activity.message} - <span>{new Date(activity.date).toLocaleDateString()}</span>
              </li>
            ))
          ) : (
            <p>No recent activities found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Feed;
