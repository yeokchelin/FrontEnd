// src/components/reviews/ReviewItem.jsx
import React from 'react';
import { Paper, Typography, Box, Rating, Avatar, Divider } from '@mui/material'; // Avatar 추가
import { useTheme, styled } from '@mui/material/styles'; // styled 추가
import { format } from 'date-fns'; // ⭐ 날짜 포맷팅 라이브러리 (npm install date-fns)

// Styled Paper for individual review items (이전 ReviewList.jsx에서 이동)
const ReviewPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const ReviewItem = ({ reviewItem }) => {
  const theme = useTheme();

  if (!reviewItem) {
    return null;
  }

  // ⭐ 백엔드 ReviewResponseDto 필드명에 맞춰 구조 분해 할당 및 기본값 설정
  const {
    author = "익명", // ⭐ 필드명 변경: authorName -> author
    rate = 0,       // ⭐ 필드명 변경: ratingValue -> rate
    title = "제목 없음",
    content = "리뷰 내용이 없습니다.", // ⭐ 필드명 변경: commentText -> content
    createdAt,
    imagePath,      // ⭐ 필드명 변경: imageUrl -> imagePath (Review 엔티티에 imagePath로 정의됨)
    restaurantName  // ⭐ 추가: ReviewResponseDto에 있는 restaurantName 필드
  } = reviewItem;

  // 날짜 포맷팅 (date-fns 사용)
  const formattedDate = createdAt
    ? format(new Date(createdAt), 'yyyy.MM.dd HH:mm') // 'ko-KR' 로케일 설정은 date-fns에서 별도로 필요
    : '날짜 알 수 없음';

  return (
    <ReviewPaper elevation={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* 아바타 (선택 사항: 작성자 이름의 첫 글자 또는 프로필 이미지) */}
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '1rem' }}>
            {author ? author.charAt(0) : 'U'} {/* ⭐ author 사용 */}
          </Avatar>
          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
            {author} {/* ⭐ author 사용 */}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {formattedDate} {/* 리뷰 작성일 */}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        component="h4"
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          wordBreak: 'break-word',
          mb: 1.5,
        }}
      >
        {title}
      </Typography>

      <Rating
        name={`rating-${reviewItem.reviewId}`} // ⭐ reviewItem.id 대신 reviewItem.reviewId 사용
        value={rate} // ⭐ rate 필드 사용
        precision={1} // 백엔드가 Integer rate를 반환하므로 0.5 대신 1이 더 적합할 수 있음. (Integer로 통일했으므로)
        readOnly
        size="small"
        sx={{ color: theme.palette.warning.main }}
      />

      <Typography
        variant="body2"
        component="p"
        sx={{
          color: 'text.secondary',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.6,
          mb: (imagePath || content !== "리뷰 내용이 없습니다.") ? 2 : 0, // ⭐ imagePath 사용
        }}
      >
        {content} {/* ⭐ content 필드 사용 */}
      </Typography>

      {/* 첨부 이미지 */}
      {imagePath && ( // ⭐ imagePath 사용
        <Box
          sx={{
            my: 2,
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src={imagePath} // ⭐ imagePath 사용
            alt={`${author}님의 리뷰 이미지`} // ⭐ author 사용
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

      {/* 리뷰 푸터: 작성일 및 식당 이름 */}
      {/* ⭐ 조건부 Divider 로직 간소화 */}
      {(createdAt || restaurantName) && <Divider sx={{ my: 1.5 }} />}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        {restaurantName && ( // ⭐ restaurantName 표시
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
            }}
          >
            식당: {restaurantName}
          </Typography>
        )}
        {createdAt && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              display: 'block',
              textAlign: 'right',
            }}
          >
            작성일: {formattedDate}
          </Typography>
        )}
      </Box>
    </ReviewPaper>
  );
};

export default ReviewItem;