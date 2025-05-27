// src/pages/ReviewPage.jsx
import React, { useState } from 'react';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import './ReviewPage.css';

const DUMMY_REVIEW_DATA = [
  { id: 1, authorName: '김철수', ratingValue: 5, commentText: '정말 좋았어요! 강력 추천합니다.', reviewDate: '2025-05-20T10:00:00Z', imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Awesome' },
  { id: 2, authorName: '이영희', ratingValue: 4, commentText: '만족스러웠지만, 약간 아쉬운 점도 있었어요.', reviewDate: '2025-05-19T11:30:00Z' },
  { id: 3, authorName: '박지민', ratingValue: 5, commentText: '기대 이상입니다. 다음에 또 이용할게요.', reviewDate: '2025-05-18T14:00:00Z', imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Good' },
  { id: 4, authorName: '최민준', ratingValue: 3, commentText: '그냥 그랬어요. 평범합니다.', reviewDate: '2025-05-17T09:00:00Z' },
];

const ReviewPage = () => {
  const [reviewList, setReviewList] = useState(DUMMY_REVIEW_DATA);

  const handleAddReview = (newReviewItem) => {
    setReviewList([newReviewItem, ...reviewList]);
  };

  const averageRating = reviewList.length > 0
    ? (reviewList.reduce((sum, item) => sum + item.ratingValue, 0) / reviewList.length).toFixed(1)
    : 0;

  return (
    // ReviewPage의 최상위 div에도 dark-mode 클래스를 적용
    // 이 클래스는 App.jsx의 최상위 div에서 상속됩니다.
    // CSS의 cascade 덕분에 상위 요소에 dark-mode 클래스가 있으면 하위 요소의 스타일이 변경됩니다.
    <div className="review-page-container">
      <h1 className="page-title">사용자 리뷰 (테스트 페이지)</h1>

      <div className="average-rating-display">
        현재 평균 별점: <span className="rating-value">{averageRating}</span> / 5
        <span className="total-reviews"> ({reviewList.length}개 리뷰)</span>
      </div>

      <ReviewForm onAddReview={handleAddReview} />
      <hr className="divider" />
      <ReviewList reviewList={reviewList} />
    </div>
  );
};

export default ReviewPage;