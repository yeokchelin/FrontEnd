// src/components/mealmateboard/MealMatePostItem.jsx
import React from 'react';
import './MealMatePostItem.css'; // 개별 게시글 스타일

const MealMatePostItem = ({ postItem }) => {
  // postItem이 없는 경우를 대비 (이론적으로는 List에서 처리하지만 방어 코드)
  if (!postItem) {
    return null;
  }

  const {
    title,
    authorName,
    meetingStation,
    meetingTime,
    content,
    status,
    partySize,
    genderPreference,
    createdAt
  } = postItem;

  // 상태에 따른 클래스 부여 (예: '모집 중'은 초록색, '모집 완료'는 회색)
  const statusClass = status === '모집 중' ? 'status-recruiting' : 'status-completed';

  return (
    <div className="mealmate-post-item">
      <div className="post-header">
        <h3 className="post-title">{title}</h3>
        <span className={`post-status ${statusClass}`}>{status}</span>
      </div>
      <div className="post-meta">
        <span className="author-name"><strong>작성자:</strong> {authorName}</span>
        <span className="created-at"><strong>작성일:</strong> {new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <div className="meeting-info">
        <p><strong><i className="icon-station"></i> 만날 역:</strong> {meetingStation}</p>
        <p><strong><i className="icon-time"></i> 만날 시간:</strong> {meetingTime}</p>
        <p><strong><i className="icon-group"></i> 모집 인원:</strong> {partySize}명</p>
        <p><strong><i className="icon-gender"></i> 선호 성별:</strong> {genderPreference}</p>
      </div>
      <div className="post-content">
        <p>{content}</p>
      </div>
      {/* 상세 보기 버튼 등 추가 가능 */}
      {/* <button className="details-button">상세 보기</button> */}
    </div>
  );
};

export default MealMatePostItem;