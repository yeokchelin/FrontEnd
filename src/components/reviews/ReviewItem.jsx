import React from 'react';
import './ReviewItem.css';

const ReviewItem = ({ reviewItem }) => {
  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= ratingValue ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <span className="review-author">{reviewItem.authorName}</span>
        <div className="review-rating">{renderStars(reviewItem.ratingValue)}</div>
      </div>
      <p className="review-comment">{reviewItem.commentText}</p>
      <div className="review-footer">
        <span className="review-date">{new Date(reviewItem.reviewDate).toLocaleDateString()}</span>
      </div>
      {reviewItem.imageUrl && (
        <div className="review-image-container">
          <img src={reviewItem.imageUrl} alt="리뷰 이미지" className="review-image" />
        </div>
      )}
    </div>
  );
};

export default ReviewItem;