// src/components/review/ReviewItem.jsx
import React from 'react';
import { Paper, Typography, Box, Rating, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// 날짜 포맷 함수 (createdAt 또는 updatedAt을 ISO 문자열로 받는다고 가정)
const formatDate = (isoString) => {
  if (!isoString) return '날짜 정보 없음';
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // 시간까지 표시하려면 아래 주석 해제
    // hour: '2-digit',
    // minute: '2-digit',
    // hour12: false
  });
};

const ReviewItem = ({ reviewItem }) => {
  const theme = useTheme();

  if (!reviewItem) {
    return null;
  }

  // 백엔드 DTO 필드명에 맞춰 구조 분해 할당 및 기본값 설정
  const {
    authorName = "익명",
    ratingValue = 0,
    title = "제목 없음", // ❗️ 리뷰 제목 필드 추가
    commentText = "리뷰 내용이 없습니다.",
    createdAt, // ❗️ reviewDate 대신 createdAt 사용
    imageUrl
  } = reviewItem;

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 2.5,
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      {/* 리뷰 헤더: 작성자 이름, 별점, (선택적으로 제목 위에 표시 가능) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1, // 제목과의 간격
        }}
      >
        <Typography
          variant="subtitle1"
          component="strong"
          sx={{ fontWeight: 'bold', color: 'text.primary' }}
        >
          {authorName}
        </Typography>
        <Rating
          name={`rating-${reviewItem.id}`} // 각 Rating 컴포넌트에 고유한 name 부여
          value={parseFloat(ratingValue)}
          readOnly
          precision={0.5}
          size="small"
          sx={{ color: theme.palette.warning.main }}
        />
      </Box>

      {/* 리뷰 제목 */}
      <Typography
        variant="h6" // 제목이므로 h6 또는 subtitle1 사용
        component="h3"
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          wordBreak: 'break-word',
          mb: 1.5, // 내용과의 간격
        }}
      >
        {title}
      </Typography>

      {/* 리뷰 본문 */}
      <Typography
        variant="body2"
        component="p"
        sx={{
          color: 'text.secondary',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.6,
          mb: (imageUrl || createdAt) ? 2 : 0, // 이미지나 날짜가 있으면 하단 마진
        }}
      >
        {commentText}
      </Typography>

      {/* 첨부 이미지 */}
      {imageUrl && (
        <Box
          sx={{
            my: 2,
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={`${authorName}님의 리뷰 이미지`}
            sx={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: 1.5,
              objectFit: 'contain',
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      )}

      {/* 리뷰 푸터: 작성일 */}
      {createdAt && (imageUrl || commentText !== "리뷰 내용이 없습니다.") && <Divider sx={{ my: 1.5 }} />}
      
      {createdAt && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            display: 'block',
            textAlign: 'right',
            // mt 로직은 Divider 유무에 따라 조절될 수 있으므로, 필요시 복원
            // mt: imageUrl && !commentText.includes("내용이 없습니다") ? 0 : (imageUrl || commentText !== "리뷰 내용이 없습니다." ? 0 : 1.5),
          }}
        >
          작성일: {formatDate(createdAt)}
        </Typography>
      )}
    </Paper>
  );
};

export default ReviewItem;