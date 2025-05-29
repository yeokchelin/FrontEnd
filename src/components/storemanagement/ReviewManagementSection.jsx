// src/components/storemanagement/ReviewManagementSection.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material'; // Paper, Divider 추가
import CustomerReviewItem from './CustomerReviewItem'; // 이미 MUI로 수정된 자식 컴포넌트
import { sampleReviews } from './dummyReviewData'; // 더미 리뷰 데이터
// './ReviewManagementSection.css' 임포트는 더 이상 필요 없습니다.

const ReviewManagementSection = () => {
  const [reviews, setReviews] = useState(sampleReviews);

  const handleReplySubmit = (reviewId, replyText) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, ownerReply: { text: replyText, repliedAt: new Date().toISOString() } }
          : review
      )
    );
    console.log(`Review ID: ${reviewId}, Reply: ${replyText}`);
    // 여기에 실제 API로 답글을 전송하는 로직을 추가합니다.
    alert('답글이 등록되었습니다! (콘솔 확인)');
  };

  return (
    // 전체 리뷰 관리 섹션을 Paper 컴포넌트로 감싸 시각적으로 구분
    <Paper
      elevation={3} // 약간의 그림자 효과
      sx={{
        p: { xs: 2, sm: 3, md: 4 }, // 섹션 전체의 내부 패딩
        my: { xs: 3, sm: 4 },       // 섹션의 상하 마진 (페이지 내 다른 요소와의 간격)
        bgcolor: 'background.paper', // 테마의 paper 배경색
        borderRadius: 2,            // 테마 기반 모서리 둥글기
        width: '100%',
        maxWidth: '900px',          // 이 섹션의 최대 너비 (필요에 따라 조절)
        mx: 'auto',                 // 페이지 내에서 중앙 정렬
      }}
    >
      <Typography
        variant="h5" // 섹션 제목에 적합한 크기
        component="h2" // 시맨틱 HTML 태그
        gutterBottom // 제목 아래에 마진 추가
        sx={{
          color: 'text.primary',
          fontWeight: 'medium',
          textAlign: 'center', // 제목 중앙 정렬
          mb: 3,               // 리뷰 목록과의 간격
        }}
      >
        고객 리뷰 관리
      </Typography>

      {reviews.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: { xs: 4, sm: 6 }, // 충분한 상하 패딩
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.secondary', fontStyle: 'italic' }}
          >
            아직 등록된 고객 리뷰가 없습니다.
          </Typography>
        </Box>
      ) : (
        // 리뷰 목록을 담는 Box. CustomerReviewItem이 자체 마진을 가지므로,
        // 이 Box는 특별한 레이아웃 스타일(예: flex, gap)이 필요 없을 수 있습니다.
        <Box className="review-list" sx={{ width: '100%' }}>
          {reviews.map((review, index) => (
            <React.Fragment key={review.id}>
              <CustomerReviewItem
                review={review}
                onReplySubmit={handleReplySubmit}
              />
              {/* 마지막 아이템이 아닐 경우에만 구분선 추가 (선택 사항) */}
              {/* {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />} */}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ReviewManagementSection;