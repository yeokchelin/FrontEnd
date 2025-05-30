// src/components/freeboard/FreePostList.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import FreePostItem from './FreePostItem'; // FreePostItem 컴포넌트 임포트

// ❗️ onPostClick prop을 새로 받습니다.
const FreePostList = ({ postList, onPostClick }) => {
  if (!postList || postList.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 4, sm: 6 },
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          아직 작성된 게시글이 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '800px', // 게시글 목록 영역의 최대 너비
        mx: 'auto',          // 중앙 정렬
        py: { xs: 2, sm: 3 }, // 목록 전체의 상하 패딩
      }}
    >
      {postList.map(item => ( // 변수명을 postItem에서 item으로 변경 (일관성)
        // ❗️ FreePostItem에 key, postItem, 그리고 onPostClick prop을 전달합니다.
        <FreePostItem
          key={item.id}
          postItem={item}
          onPostClick={onPostClick} // 각 아이템 클릭 시 호출될 함수
        />
      ))}
    </Box>
  );
};

export default FreePostList;