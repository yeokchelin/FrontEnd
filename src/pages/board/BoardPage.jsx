// src/pages/board/BoardPage.jsx
// 사용x
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './BoardPage.css';

const BoardPage = () => {
  return (
    <div className="board-page-container">
      <h1 className="main-board-title">게시판</h1>
      <nav className="board-nav">
        <ul>
          <li>
            <Link to="free" className="nav-link">자유 게시판</Link>
          </li>
          <li>
            <Link to="mealmate" className="nav-link">밥친구 구하기</Link>
          </li>
          {/* <li>
            <Link to="poll" className="nav-link">식당 투표</Link> // ✨ 식당 투표 링크 제거 ✨
          </li> */}
        </ul>
      </nav>
      <div className="board-content">
        <Outlet />
      </div>
    </div>
  );
};

export default BoardPage;