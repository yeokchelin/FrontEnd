// src/pages/test/PollTestPage.jsx
import React from 'react';
import PollDetailPage from '../poll/PollDetailPage'; // PollDetailPage 경로에 맞게 수정해주세요.
import './PollTestPage.css'; // 이 테스트 페이지 자체를 위한 CSS

const PollTestPage = () => {
  return (
    <div className="poll-test-page-container">
      <header className="test-page-header-info">
        <h1>투표 상세 페이지 (PollDetailPage) 테스트</h1>
        <p>이 페이지는 PollDetailPage 컴포넌트의 기능과 UI를 테스트하기 위한 페이지입니다.</p>
        <p>아래에 PollDetailPage의 실제 내용이 표시됩니다.</p>
      </header>
      <hr className="test-page-divider" />
      
      {/* 실제 테스트할 컴포넌트 렌더링 */}
      <PollDetailPage />

      <hr className="test-page-divider" />
      <footer className="test-page-footer-info">
        <p>테스트 페이지 끝</p>
      </footer>
    </div>
  );
};

export default PollTestPage;