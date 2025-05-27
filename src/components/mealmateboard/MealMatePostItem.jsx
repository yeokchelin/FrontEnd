// src/components/mealmateboard/MealMatePostItem.jsx
import React from 'react';
import './MealMatePostItem.css'; // 이 컴포넌트의 스타일 파일

const MealMatePostItem = ({ postItem }) => {
  // ISO 문자열을 읽기 쉬운 날짜/시간 형식으로 변환
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // 24시간 형식
    });
  };

  // 모집 상태에 따라 다른 클래스 적용 (CSS에서 색상 정의)
  const statusClass = `status-${postItem.status.replace(/\s/g, '').toLowerCase()}`;

  return (
    <div className="mealmate-post-item"> {/* 클래스명 변경됨 */}
      <div className="post-header">
        <h3 className="post-title">{postItem.title}</h3>
        <span className={`post-status ${statusClass}`}>
          {postItem.status}
        </span>
      </div>
      <div className="post-details">
        <p>
          <span className="detail-label">역:</span> {postItem.meetingStation}
        </p>
        <p>
          <span className="detail-label">시간:</span> {postItem.meetingTime}
        </p>
        <p>
          <span className="detail-label">인원:</span> {postItem.partySize}명
        </p>
        {postItem.genderPreference && postItem.genderPreference !== '무관' && ( // '무관'일 경우 표시 안 함
          <p>
            <span className="detail-label">성별:</span> {postItem.genderPreference}
          </p>
        )}
      </div>
      <p className="post-content">{postItem.content}</p>
      <div className="post-footer">
        <span className="post-author">{postItem.authorName}</span>
        <span className="post-date">{formatDateTime(postItem.createdAt)}</span>
      </div>
    </div>
  );
};

export default MealMatePostItem; // 컴포넌트명 변경됨