// src/components/reviews/ReviewList.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ReviewItem from './ReviewItem'; // 이미 MUI Paper로 스타일링된 컴포넌트

const ReviewList = ({ reviewList }) => {
  if (!reviewList || reviewList.length === 0) {
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
          variant="subtitle1" // 메시지에 적절한 텍스트 크기
          sx={{
            color: 'text.secondary', // 테마의 보조 텍스트 색상 사용
            fontStyle: 'italic',      // 스타일 유지
          }}
        >
          아직 리뷰가 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        // 이 Box는 ReviewItem (Paper) 목록 전체를 감싸는 컨테이너입니다.
        width: '100%',
        maxWidth: '800px',    // 리뷰 목록 영역의 최대 너비 (디자인에 맞게 조절)
        mx: 'auto',            // 좌우 마진을 auto로 설정하여 중앙 정렬
        py: { xs: 2, sm: 3 }, // 목록 전체의 상하 패딩
        display: 'flex',      // 아이템들을 flex 컨테이너로 정렬
        flexDirection: 'column', // 세로로 정렬
        gap: 2,               // 아이템 간 간격
      }}
    >
      {reviewList.map(item => (
        // ReviewItem은 이미 MUI Paper로 스타일링 되어 있습니다.
        // ⭐ key를 item.reviewId로 변경
        <ReviewItem key={item.reviewId} reviewItem={item} />
      ))}
    </Box>
  );
};

export default ReviewList;