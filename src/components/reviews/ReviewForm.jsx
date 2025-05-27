import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ onAddReview }) => {
  const [authorName, setAuthorName] = useState('');
  const [ratingValue, setRatingValue] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!authorName || !commentText || ratingValue === 0) {
      alert('작성자, 별점, 내용을 모두 입력해주세요.');
      return;
    }

    const newReview = {
      id: Date.now(),
      authorName,
      ratingValue,
      commentText,
      reviewDate: new Date().toISOString(),
      imageUrl: imagePreviewUrl
    };

    onAddReview(newReview);

    // 폼 초기화
    setAuthorName('');
    setRatingValue(0);
    setCommentText('');
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const handleRatingChange = (newRating) => {
    setRatingValue(newRating);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>리뷰 작성하기</h2>
      <div className="form-group">
        <label htmlFor="authorName">작성자</label>
        <input
          type="text"
          id="authorName"
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>별점</label>
        <div className="star-rating-input">
          {[1, 2, 3, 4, 5].map((starNumber) => (
            <span
              key={starNumber}
              className={`star-input ${starNumber <= ratingValue ? 'filled' : ''}`}
              onClick={() => handleRatingChange(starNumber)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="commentText">리뷰 내용</label>
        <textarea
          id="commentText"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          rows="5"
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="imageFile">사진 첨부 (선택 사항)</label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreviewUrl && (
          <div className="image-preview-container">
            <img src={imagePreviewUrl} alt="이미지 미리보기" className="image-preview" />
            <button type="button" onClick={() => { setImageFile(null); setImagePreviewUrl(null); }} className="remove-image-button">
              사진 삭제
            </button>
          </div>
        )}
      </div>
      <button type="submit" className="submit-button">리뷰 제출</button>
    </form>
  );
};

export default ReviewForm;