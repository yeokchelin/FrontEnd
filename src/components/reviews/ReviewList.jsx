import React from 'react';
import ReviewItem from './ReviewItem';
import './ReviewList.css';

const ReviewList = ({ reviewList }) => {
  if (!reviewList || reviewList.length === 0) {
    return <p className="no-reviews">아직 리뷰가 없습니다.</p>;
  }

  return (
    <div className="review-list">
      {reviewList.map(item => (
        <ReviewItem key={item.id} reviewItem={item} />
      ))}
    </div>
  );
};

export default ReviewList;