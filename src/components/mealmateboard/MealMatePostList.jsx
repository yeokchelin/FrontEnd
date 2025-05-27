// src/components/mealmateboard/MealMatePostForm.jsx
import React, { useState } from 'react';
import './MealMatePostForm.css'; // 스타일 파일명 변경됨

const MealMatePostForm = ({ onAddPost }) => {
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [meetingStation, setMeetingStation] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [genderPreference, setGenderPreference] = useState('무관'); // 기본값 '무관'

  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지
    if (!authorName || !postTitle || !postContent || !meetingStation || !meetingTime || partySize <= 0) {
      alert('작성자, 제목, 내용, 만날 역, 시간, 인원은 필수 입력 항목입니다.');
      return;
    }

    const newPost = {
      id: Date.now(), // 간단한 고유 ID (실제 앱에서는 서버에서 생성)
      authorName,
      title: postTitle,
      content: postContent,
      meetingStation,
      meetingTime,
      partySize: Number(partySize), // 숫자로 변환
      genderPreference,
      status: '모집 중', // 초기 게시글 상태
      createdAt: new Date().toISOString(), // 현재 시간 ISO 형식으로 저장
    };

    onAddPost(newPost); // 부모 컴포넌트로 새 게시글 데이터 전달

    // 폼 초기화
    setAuthorName('');
    setPostTitle('');
    setPostContent('');
    setMeetingStation('');
    setMeetingTime('');
    setPartySize(1);
    setGenderPreference('무관');
  };

  return (
    <form className="mealmate-post-form" onSubmit={handleSubmit}> {/* 클래스명 변경됨 */}
      <h2>밥친구 구하기</h2>
      <div className="form-group">
        <label htmlFor="authorName">작성자 닉네임</label>
        <input
          type="text"
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="postTitle">제목</label>
        <input
          type="text"
          id="postTitle"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="postContent">내용</label>
        <textarea
          id="postContent"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows="5"
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="meetingStation">만날 역</label>
        <input
          type="text"
          id="meetingStation"
          value={meetingStation}
          onChange={(e) => setMeetingStation(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="meetingTime">만날 시간</label>
        <input
          type="text"
          id="meetingTime"
          placeholder="예: 오후 1시, 13:00"
          value={meetingTime}
          onChange={(e) => setMeetingTime(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="partySize">구하는 인원</label>
        <input
          type="number"
          id="partySize"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="genderPreference">성별 선호</label>
        <select
          id="genderPreference"
          value={genderPreference}
          onChange={(e) => setGenderPreference(e.target.value)}
        >
          <option value="무관">무관</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>
      </div>
      <button type="submit" className="submit-button">게시글 작성</button>
    </form>
  );
};

export default MealMatePostForm; // 컴포넌트명 변경됨