// src/components/mealmateboard/MealMatePostList.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import MealMatePostItem from './MealMatePostItem'; // 방금 만든 Item 컴포넌트 (MUI Card)
// './MealMatePostList.css' 임포트는 더 이상 필요 없습니다.

const MealMatePostList = ({ postList }) => {
  if (!postList || postList.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 4, sm: 6 }, // 충분한 상하 패딩
          textAlign: 'center',    // 내부 Typography도 중앙 정렬되도록
          width: '100%',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary', // 테마의 보조 텍스트 색상
            fontStyle: 'italic',    // 스타일 유지
          }}
        >
          아직 밥친구 게시글이 없습니다. 첫 글을 작성해보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        // 이 Box는 MealMatePostItem (Card) 목록 전체를 감싸는 컨테이너입니다.
        width: '100%',
        // Card는 일반적으로 FreePostItem(Paper)보다 너비가 있을 수 있으므로,
        // 페이지 레이아웃에 따라 maxWidth를 조절하거나,
        // MealMateBoardPage에서 전체 페이지 너비를 제어할 수도 있습니다.
        // 여기서는 FreePostList와 유사하게 설정합니다.
        maxWidth: '800px',   // 카드 목록 영역의 최대 너비 (디자인에 맞게 조절)
        mx: 'auto',          // 좌우 마진을 auto로 설정하여 중앙 정렬
        py: { xs: 2, sm: 3 }, // 목록 전체의 상하 패딩
      }}
    >
      {/* 목록 제목 ("밥친구 게시글 목록")은 일반적으로 이 컴포넌트를 사용하는 
        페이지 컴포넌트(예: MealMateBoardPage.jsx)에서 제공하는 것이 좋습니다.
      */}
      {postList.map(postItem => (
        // MealMatePostItem은 이미 MUI Card로 스타일링 되어 있습니다.
        <MealMatePostItem key={postItem.id} postItem={postItem} />
      ))}
    </Box>
  );
};

export default MealMatePostList;