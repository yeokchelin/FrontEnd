// src/pages/board/FreeBoardPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Divider } from '@mui/material'; // MUI 컴포넌트 임포트

// 자유 게시판 관련 자식 컴포넌트 임포트
import FreePostList from '../../components/freeboard/FreePostList';
import FreePostForm from '../../components/freeboard/FreePostForm';
// './FreeBoardPage.css' 임포트는 더 이상 필요 없습니다.

// 자유 게시판 테스트를 위한 더미 데이터 (그대로 유지)
const DUMMY_FREE_POST_DATA = [
  { id: 1, authorName: '자유인', title: '안녕하세요! 자유 게시판입니다.', content: '자유롭게 글을 남겨주세요!', createdAt: '2025-05-27T15:00:00Z' },
  { id: 2, authorName: '질문러', title: 'React 질문있어요!', content: '훅 사용법이 궁금합니다.', createdAt: '2025-05-27T14:30:00Z' },
  { id: 3, authorName: '새로운 소식', title: '개발 근황 공유합니다.', content: '요즘 새로운 기술 스택을 배우고 있습니다.', createdAt: '2025-05-26T10:00:00Z' },
];

const FreeBoardPage = () => {
  const [freePostList, setFreePostList] = useState(DUMMY_FREE_POST_DATA);

  // 게시글 작성 시 호출될 함수 (그대로 유지)
  const handleAddFreePost = (newPostItem) => {
    setFreePostList(prevPosts => [newPostItem, ...freePostList]);
  };

  return (
    // 기존 div.free-board-page-container를 Box로 대체
    <Box
      sx={{
        width: '100%', // App.jsx의 <main> 영역의 너비를 채웁니다.
                       // App.jsx <main>에 alignItems:'center'가 있으므로 이 Box는 중앙 정렬된 공간을 차지합니다.
        // bgcolor: 'background.default', // 명시적으로 설정할 수도 있지만, 기본적으로 부모 배경색을 상속합니다.
                                        // App.jsx의 <main> 영역이 이미 background.default를 가집니다.
        py: { xs: 2, sm: 3 },         // 페이지 콘텐츠의 상하 패딩
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // 자식 요소들(제목, 폼, 구분선, 리스트)을 가로축 중앙에 배치
        gap: { xs: 2.5, sm: 3 },       // 자식 요소들 사이의 수직 간격
      }}
    >
      <Typography
        variant="h4" // 페이지 제목에 적합한 크기
        component="h1" // 시맨틱 HTML 태그
        sx={{
          color: 'text.primary', // 테마의 주요 텍스트 색상
          textAlign: 'center',
          // mb: 3, // 하단 마진은 부모 Box의 gap으로 처리되므로 중복될 수 있어 주석 처리
        }}
      >
        자유 게시판
      </Typography>

      {/* FreePostForm은 이미 Paper로 스타일링 되어 있으며, 
          자체적으로 maxWidth 및 ml/mr: 'auto'를 통해 중앙 정렬됩니다. */}
      <FreePostForm onAddPost={handleAddFreePost} />

      {/* 구분선 */}
      <Divider
        sx={{
          width: '100%', // 구분선 너비
          maxWidth: { // FreePostForm/List와 유사한 최대 너비로 제한하여 일관성 유지
            xs: `calc(100% - ${theme => theme.spacing(4)})`, // 좌우 패딩 고려
            sm: '700px', // FreePostForm의 maxWidth와 유사하게
          },
          my: 2, // 구분선의 상하 마진
        }}
      />

      {/* FreePostList는 내부에 FreePostItem(Paper)들을 포함하며,
          자체적으로 maxWidth 및 mx: 'auto'를 통해 중앙 정렬됩니다. */}
      <FreePostList postList={freePostList} />
    </Box>
  );
};

export default FreeBoardPage;