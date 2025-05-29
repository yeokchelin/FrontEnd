// src/components/freeboard/FreePostList.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import FreePostItem from './FreePostItem';
// './FreePostList.css' 임포트는 더 이상 필요 없습니다.

const FreePostList = ({ postList }) => {
  if (!postList || postList.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex', // 내부 Typography를 중앙 정렬하기 위함
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 4, sm: 6 }, // 충분한 상하 패딩을 줌
          // minHeight: '200px', // 내용이 없을 때 최소 높이를 확보하고 싶다면 (선택 사항)
          width: '100%', // 부모 요소의 너비를 채움
        }}
      >
        <Typography
          variant="subtitle1" // 메시지에 적절한 텍스트 크기
          sx={{
            color: 'text.secondary', // 테마의 보조 텍스트 색상 사용
            fontStyle: 'italic',   // 기존 스타일 유지 (기울임꼴)
            textAlign: 'center',     // 텍스트 중앙 정렬
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
        // 이 Box는 FreePostItem 목록 전체를 감싸는 컨테이너입니다.
        // 각 FreePostItem은 자체적으로 하단 마진(mb)을 가지고 있습니다.
        width: '100%', // 사용 가능한 너비를 채우도록 설정
        maxWidth: '800px',   // 게시글 목록 영역의 최대 너비 (디자인에 맞게 조절)
        mx: 'auto',          // 좌우 마진을 auto로 설정하여 중앙 정렬
        py: { xs: 2, sm: 3 }, // 목록 전체의 상하 패딩
      }}
    >
      {postList.map(postItem => (
        // FreePostItem은 이미 MUI Paper로 스타일링 되어 있습니다.
        <FreePostItem key={postItem.id} postItem={postItem} />
      ))}
    </Box>
  );
};

export default FreePostList;