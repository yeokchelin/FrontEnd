// src/pages/board/MealMateBoardPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Divider } from '@mui/material'; // MUI 컴포넌트 임포트

// MealMatePostList와 MealMatePostForm 임포트 경로는 그대로 사용
import MealMatePostList from '../../components/mealmateboard/MealMatePostList';
import MealMatePostForm from '../../components/mealmateboard/MealMatePostForm';
// './MealMateBoardPage.css' 임포트는 더 이상 필요 없습니다.

// 게시판 테스트를 위한 더미 데이터 (그대로 유지)
const DUMMY_POST_DATA = [
  {
    id: 1,
    authorName: '밥친구123',
    title: '강남역 점심 밥친구 구해요!',
    content: '오늘 점심 12시 30분에 강남역 근처 파스타집 가려는데 밥친구 구합니다. 혼밥이 지겨우신 분 환영!',
    meetingStation: '강남역',
    meetingTime: '12:30',
    partySize: 1,
    genderPreference: '무관',
    status: '모집 중',
    createdAt: '2025-05-27T10:00:00Z',
  },
  {
    id: 2,
    authorName: '역삼혼밥러',
    title: '역삼역 저녁 같이 드실 분~',
    content: '오후 6시 30분 역삼역 근처 한식집 가실 분 구해요. 찌개류 먹을 예정이고, 대화 좋아하시는 분이면 좋겠습니다.',
    meetingStation: '역삼역',
    meetingTime: '18:30',
    partySize: 1,
    genderPreference: '여성',
    status: '모집 중',
    createdAt: '2025-05-27T09:15:00Z',
  },
  {
    id: 3,
    authorName: '테스트용',
    title: '모집 완료된 게시글 예시',
    content: '이 게시글은 모집이 완료된 상태입니다.',
    meetingStation: '선릉역',
    meetingTime: '14:00',
    partySize: 2,
    genderPreference: '남성',
    status: '모집 완료',
    createdAt: '2025-05-26T18:00:00Z',
  },
];

const MealMateBoardPage = () => {
  console.log("MealMateBoardPage 렌더링 시작!");
  const [postList, setPostList] = useState(DUMMY_POST_DATA);

  // 게시글 추가 시 호출될 함수 (그대로 유지)
  const handleAddPost = (newPostItem) => {
    console.log("새 게시글 추가 시도:", newPostItem);
    setPostList(prevPosts => [newPostItem, ...postList]);
    console.log("업데이트된 postList:", [newPostItem, ...postList]);
  };

  console.log("현재 postList 상태:", postList);

  return (
    // 기존 div.mealmate-board-page-container를 Box로 대체
    <Box
      sx={{
        width: '100%', // App.jsx의 <main> 영역의 너비를 채움
        // bgcolor: 'transparent', // 기본값. App.jsx의 <main> 배경색(background.default)을 상속받음
        py: { xs: 2, sm: 3 },     // 페이지 콘텐츠의 상하 패딩
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',   // 자식 요소들을 가로축 중앙에 배치
        gap: { xs: 2.5, sm: 3 }, // 자식 요소들(제목, 폼, 구분선, 리스트) 사이의 수직 간격
      }}
    >
      <Typography
        variant="h4" // 페이지 제목에 적합한 크기
        component="h1" // 시맨틱 HTML 태그
        sx={{
          color: 'text.primary', // 테마의 주요 텍스트 색상
          textAlign: 'center',
        }}
      >
        밥친구 구하기 게시판
      </Typography>

      {/* MealMatePostForm은 이미 Paper로 스타일링 되어 있으며,
          자체적으로 maxWidth 및 ml/mr: 'auto'를 통해 중앙 정렬됩니다. */}
      <MealMatePostForm onAddPost={handleAddPost} />

      {/* 구분선 */}
      <Divider
        sx={{
          width: '100%', // 구분선 너비
          maxWidth: { // MealMatePostList/Form 과 유사한 최대 너비로 제한하여 일관성 유지
            xs: `calc(100% - ${(theme) => theme.spacing(4)})`, // 좌우 패딩 고려 시
            sm: '800px', // MealMatePostList의 maxWidth와 유사하게
          },
          my: 2, // 구분선의 상하 마진 (기존 1에서 약간 늘림)
        }}
      />

      {/* MealMatePostList는 자체적으로 maxWidth 및 중앙 정렬을 가짐 */}
      <MealMatePostList postList={postList} />
    </Box>
  );
};

export default MealMateBoardPage;