// src/components/storemanagement/ReviewManagementSection.jsx
import React, { useState } from 'react';
import CustomerReviewItem from './CustomerReviewItem';
import { sampleReviews } from './dummyReviewData'; // 더미 리뷰 데이터
import './ReviewManagementSection.css'; // CSS 파일은 아래에서 만듭니다.

const ReviewManagementSection = () => {
  const [reviews, setReviews] = useState(sampleReviews);

  const handleReplySubmit = (reviewId, replyText) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, ownerReply: { text: replyText, repliedAt: new Date().toISOString() } }
          : review
      )
    );
    console.log(`Review ID: ${reviewId}, Reply: ${replyText}`);
    // 여기에 실제 API로 답글을 전송하는 로직을 추가합니다.
    alert('답글이 등록되었습니다! (콘솔 확인)');
  };

  return (
    <div className="review-management-section">
      <h3>고객 리뷰 관리</h3>
      {reviews.length === 0 ? (
        <p className="no-reviews-message">아직 등록된 고객 리뷰가 없습니다.</p>
      ) : (
        <div className="review-list">
          {reviews.map(review => (
            <CustomerReviewItem
              key={review.id}
              review={review}
              onReplySubmit={handleReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManagementSection;