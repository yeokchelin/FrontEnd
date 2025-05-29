// src/pages/ReviewPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Divider, Rating, Paper } from '@mui/material'; // MUI Rating 컴포넌트 임포트
import ReviewList from '../../components/reviews/ReviewList'; // 이미 MUI로 수정된 컴포넌트
import ReviewForm from '../../components/reviews/ReviewForm'; // 이미 MUI로 수정된 컴포넌트
// './ReviewPage.css' 임포트는 더 이상 필요 없습니다.

const DUMMY_REVIEW_DATA = [
  { id: 1, authorName: '김철수', ratingValue: 5, commentText: '정말 좋았어요! 강력 추천합니다.', reviewDate: '2025-05-20T10:00:00Z', imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Awesome' },
  { id: 2, authorName: '이영희', ratingValue: 4, commentText: '만족스러웠지만, 약간 아쉬운 점도 있었어요.', reviewDate: '2025-05-19T11:30:00Z' },
  { id: 3, authorName: '박지민', ratingValue: 5, commentText: '기대 이상입니다. 다음에 또 이용할게요.', reviewDate: '2025-05-18T14:00:00Z', imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Good' },
  { id: 4, authorName: '최민준', ratingValue: 3, commentText: '그냥 그랬어요. 평범합니다.', reviewDate: '2025-05-17T09:00:00Z' },
];

const ReviewPage = () => {
  const [reviewList, setReviewList] = useState(DUMMY_REVIEW_DATA);

  const handleAddReview = (newReviewItem) => {
    // 이전 상태를 기반으로 상태를 업데이트할 때는 함수형 업데이트를 사용하는 것이 더 안전합니다.
    setReviewList(prevList => [newReviewItem, ...prevList]);
  };

  // 평균 별점 계산 (toFixed(1)은 문자열을 반환하므로 parseFloat으로 다시 숫자 변환)
  const averageRating = reviewList.length > 0
    ? parseFloat((reviewList.reduce((sum, item) => sum + item.ratingValue, 0) / reviewList.length).toFixed(1))
    : 0;

  return (
    <Box
      sx={{
        width: '100%', // App.jsx의 <main> 영역 너비를 채움
        py: { xs: 2, sm: 3, md: 4 }, // 페이지 콘텐츠의 상하 패딩
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',   // 자식 요소들을 가로축 중앙에 배치
        gap: { xs: 3, sm: 4 },  // 주요 섹션 간의 수직 간격 (기존보다 약간 늘림)
      }}
    >
      <Typography
        variant="h4" // 페이지 제목
        component="h1"
        sx={{
          color: 'text.primary',
          textAlign: 'center',
          fontWeight: 'medium', // 약간의 굵기
        }}
      >
        사용자 리뷰
      </Typography>

      {/* 평균 별점 표시 영역 */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          bgcolor: 'action.hover', // 테마의 호버 배경색과 유사한 미묘한 배경
          borderRadius: 1.5,
          width: 'fit-content', // 내용에 맞게 너비 조절
          mx: 'auto', // 중앙 정렬
        }}
      >
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          평균 별점:
        </Typography>
        <Rating
          name="average-rating-display"
          value={averageRating}
          precision={0.1} // 평균값을 소수점 첫째 자리까지 정확하게 표시
          readOnly
          size="medium" // 별 크기 "small", "medium", "large"
          sx={{ color: 'warning.main' }} // 별 색상을 테마의 warning 색상으로
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {averageRating}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          / 5
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
          ({reviewList.length}개 리뷰)
        </Typography>
      </Paper>

      {/* 리뷰 작성 폼 */}
      <ReviewForm onAddReview={handleAddReview} />

      {/* 구분선 */}
      <Divider
        sx={{
          width: '100%',
          maxWidth: { // ReviewList와 유사한 최대 너비로 제한
            xs: `calc(100% - ${(theme) => theme.spacing(4)})`,
            sm: '800px',
          },
          my: 2, // 구분선의 상하 마진
        }}
      />

      {/* 리뷰 목록 */}
      <ReviewList reviewList={reviewList} />
    </Box>
  );
};

export default ReviewPage;