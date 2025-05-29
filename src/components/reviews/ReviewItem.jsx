// src/components/review/ReviewItem.jsx
import React from 'react';
import { Paper, Typography, Box, Rating, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // 테마의 색상 등을 직접 사용하기 위해

// './ReviewItem.css' 임포트는 더 이상 필요 없습니다.

// 날짜 포맷 함수 (필요에 따라 프로젝트 공통 유틸로 옮겨도 좋습니다)
const formatDate = (isoString) => {
  if (!isoString) return '날짜 정보 없음';
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long', // '2-digit' 또는 'short' 보다 자세하게
    day: 'numeric',
  });
};

const ReviewItem = ({ reviewItem }) => {
  const theme = useTheme(); // 현재 테마 객체 가져오기

  // reviewItem 데이터가 없을 경우를 대비
  if (!reviewItem) {
    return null; // 또는 <Typography>리뷰 정보를 불러올 수 없습니다.</Typography> 등
  }

  // 구조 분해 할당 시 기본값 설정으로 안정성 높임
  const {
    authorName = "익명",
    ratingValue = 0,
    commentText = "리뷰 내용이 없습니다.",
    reviewDate,
    imageUrl
  } = reviewItem;

  return (
    <Paper
      elevation={2} // Paper에 약간의 그림자 효과
      sx={{
        p: { xs: 2, sm: 2.5 }, // 내부 패딩 (16px ~ 20px)
        mb: 2.5,               // 각 리뷰 아이템 사이의 하단 마진
        bgcolor: 'background.paper', // 테마의 paper 배경색
        borderRadius: 2,          // 테마 기반 모서리 둥글기
      }}
    >
      {/* 리뷰 헤더: 작성자 이름과 별점 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // 양쪽 끝으로 정렬
          alignItems: 'center',           // 수직 중앙 정렬
          mb: 1.5,                        // 내용과의 하단 간격
        }}
      >
        <Typography
          variant="subtitle1" // 작성자 이름에 적합한 크기
          component="strong"    // 시맨틱하게 강조
          sx={{ fontWeight: 'bold', color: 'text.primary' }}
        >
          {authorName}
        </Typography>
        <Rating
          name="read-only-rating"
          value={parseFloat(ratingValue)} // ratingValue가 문자열일 경우를 대비해 숫자로 변환
          readOnly // 읽기 전용으로 설정
          precision={0.5} // 0.5 단위 별점 표시 가능 (필요 없다면 1로)
          size="small"    // 별 크기: "small", "medium", "large"
          sx={{
            // 별 색상은 테마의 warning 색상을 사용하거나 직접 지정 가능
            color: theme.palette.warning.main, // 보통 노란색/주황색 계열
            // '& .MuiRating-iconFilled': { color: '#ffb400' }, // 채워진 별 색상 직접 지정
            // '& .MuiRating-iconEmpty': { color: theme.palette.action.disabled }, // 빈 별 색상
          }}
        />
      </Box>

      {/* 리뷰 본문 */}
      <Typography
        variant="body2" // 본문 내용에 적합
        component="p"
        sx={{
          color: 'text.secondary',  // 약간 연한 텍스트 색상
          whiteSpace: 'pre-wrap', // 사용자가 입력한 줄바꿈 및 공백 유지
          wordBreak: 'break-word',  // 긴 내용이 레이아웃을 깨지 않도록
          lineHeight: 1.6,          // 줄 간격
          mb: (imageUrl || reviewDate) ? 2 : 0, // 이미지나 날짜가 있으면 하단 마진, 없으면 0
        }}
      >
        {commentText}
      </Typography>

      {/* 첨부 이미지 (있을 경우에만 표시) */}
      {imageUrl && (
        <Box
          sx={{
            my: 2, // 이미지 위아래 마진
            textAlign: 'center', // 이미지를 중앙에 배치 (이미지가 컨테이너보다 작을 경우)
          }}
        >
          <Box
            component="img" // Box를 img 태그로 렌더링
            src={imageUrl}
            alt={`${authorName}님의 리뷰 이미지`}
            sx={{
              maxWidth: '100%',       // 컨테이너 너비를 넘지 않도록
              maxHeight: '300px',     // 이미지 최대 높이 제한
              borderRadius: 1.5,      // 이미지 모서리 약간 둥글게
              objectFit: 'contain',   // 이미지 비율 유지하며 컨테이너 안에 맞춤
              border: `1px solid ${theme.palette.divider}`, // 이미지에 미세한 테두리
            }}
          />
        </Box>
      )}

      {/* 리뷰 푸터: 작성일 (작성일이 있고, 이미지 또는 내용이 있을 때만 구분선 표시) */}
      {reviewDate && (imageUrl || commentText !== "리뷰 내용이 없습니다.") && <Divider sx={{ my: 1.5 }} />}
      
      {reviewDate && (
        <Typography
          variant="caption" // 날짜 표시에 적합한 작은 크기
          sx={{
            color: 'text.disabled', // 매우 연한 텍스트 색상 (메타 정보용)
            display: 'block',       // 전체 너비 차지
            textAlign: 'right',     // 오른쪽 정렬
            mt: imageUrl && !commentText.includes("내용이 없습니다") ? 0 : (imageUrl || commentText !== "리뷰 내용이 없습니다." ? 0 : 1.5), // 이미지 유무에 따른 마진 조정
          }}
        >
          {formatDate(reviewDate)}
        </Typography>
      )}
    </Paper>
  );
};

export default ReviewItem;