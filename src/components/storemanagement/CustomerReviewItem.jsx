// src/components/storemanagement/CustomerReviewItem.jsx
import React, { useState } from 'react';
import './CustomerReviewItem.css'; // CSS 파일은 아래에서 만듭니다.

const CustomerReviewItem = ({ review, onReplySubmit }) => {
  const [replyText, setReplyText] = useState(review.ownerReply ? review.ownerReply.text : '');
  const [isReplying, setIsReplying] = useState(!review.ownerReply); // 답글이 없으면 바로 작성 모드

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') {
      alert('답글 내용을 입력해주세요.');
      return;
    }
    onReplySubmit(review.id, replyText);
    setIsReplying(false); // 답글 제출 후 보기 모드로 (선택적: 계속 수정 가능하게 할 수도 있음)
  };

  // 간단한 별점 표시 (선택 사항)
  const renderStars = (rating) => {
    if (!rating) return null;
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="customer-review-item">
      <div className="review-header">
        <span className="customer-name">{review.customerName}</span>
        {review.rating && <span className="review-rating">{renderStars(review.rating)}</span>}
        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="review-text">{review.text}</p>

      {review.ownerReply && !isReplying && (
        <div className="owner-reply-display">
          <h4>사장님 답글:</h4>
          <p>{review.ownerReply.text}</p>
          <small>답글 작성일: {new Date(review.ownerReply.repliedAt).toLocaleDateString()}</small>
          <button onClick={() => setIsReplying(true)} className="edit-reply-button">답글 수정</button>
        </div>
      )}

      {isReplying && (
        <form onSubmit={handleSubmit} className="owner-reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="고객님의 소중한 리뷰에 답글을 작성해주세요."
            rows="3"
            required
          />
          <div className="reply-form-actions">
            {review.ownerReply && <button type="button" onClick={() => setIsReplying(false)} className="cancel-reply-button">취소</button>}
            <button type="submit" className="submit-reply-button">
              {review.ownerReply ? '답글 수정 완료' : '답글 달기'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerReviewItem;