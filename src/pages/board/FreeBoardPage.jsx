// src/pages/board/FreeBoardPage.jsx
import React, { useState } from 'react';
// 자유 게시판 컴포넌트 임포트 (경로 확인)
import FreePostList from '../../components/freeboard/FreePostList';
import FreePostForm from '../../components/freeboard/FreePostForm';
import './FreeBoardPage.css'; // 이 페이지의 스타일 파일

// 자유 게시판 테스트를 위한 더미 데이터
const DUMMY_FREE_POST_DATA = [
  { id: 1, authorName: '자유인', title: '안녕하세요! 자유 게시판입니다.', content: '자유롭게 글을 남겨주세요!', createdAt: '2025-05-27T15:00:00Z' },
  { id: 2, authorName: '질문러', title: 'React 질문있어요!', content: '훅 사용법이 궁금합니다.', createdAt: '2025-05-27T14:30:00Z' },
  { id: 3, authorName: '새로운 소식', title: '개발 근황 공유합니다.', content: '요즘 새로운 기술 스택을 배우고 있습니다.', createdAt: '2025-05-26T10:00:00Z' },
];

const FreeBoardPage = () => {
  const [freePostList, setFreePostList] = useState(DUMMY_FREE_POST_DATA);

  // 게시글 작성 시 호출될 함수
  const handleAddFreePost = (newPostItem) => {
    setFreePostList([newPostItem, ...freePostList]); // 최신 글이 맨 위로 오도록
  };

  return (
    <div className="free-board-page-container">
      <h2 className="page-title">자유 게시판</h2>

      {/* FreePostForm을 사용하여 자유 게시판 글 작성 폼 렌더링 */}
      <FreePostForm onAddPost={handleAddFreePost} />

      <hr className="divider" />

      {/* FreePostList를 사용하여 자유 게시판 글 목록 렌더링 */}
      <FreePostList postList={freePostList} />
    </div>
  );
};

export default FreeBoardPage;