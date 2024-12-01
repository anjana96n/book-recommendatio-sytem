import React from 'react';
import '../../assets/styles/global.css';

const Feed = () => {
  const posts = [
    { id: 1, title: "Exploring React for Beginners", description: "A comprehensive guide for learning React." },
    { id: 2, title: "JavaScript Tips and Tricks", description: "Improve your JavaScript skills with these helpful tips." },
    { id: 3, title: "Top 10 Books to Read in 2024", description: "Discover the most anticipated books for this year." },
  ];

  return (
    <div className="feed-container">
      <h2 className="feed-title">Welcome to the Book Feed!</h2>
      <p className="feed-intro">Explore the latest books and reviews shared by our community.</p>

      <div className="feed-content">
        {posts.length === 0 ? (
          <p className="empty-feed">No posts available. Check back later!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="feed-item">
              <h3 className="feed-item-title">{post.title}</h3>
              <p className="feed-item-description">{post.description}</p>
            </div>
          ))
        )}
      </div>

      <button className="go-back-button">Back to Home</button>
    </div>
  );
};

export default Feed;
