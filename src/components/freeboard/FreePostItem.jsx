// src/components/freeboard/FreePostItem.jsx
import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
// './FreePostItem.css' 임포트는 더 이상 필요 없습니다.

// 날짜 포맷 함수는 그대로 사용합니다.
const formatDateTime = (isoString) => {
  if (!isoString) return ''; // isoString이 없을 경우 빈 문자열 반환
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const FreePostItem = ({ postItem }) => {
  // postItem 데이터가 없을 경우를 대비한 방어 코드
  if (!postItem) {
    return null; // 또는 적절한 로딩/에러 UI
  }

  return (
    <Paper
      elevation={2} // Paper 컴포넌트에 약간의 그림자 효과를 줍니다.
      sx={{
        p: { xs: 2, sm: 2.5 }, // 반응형 패딩 (16px ~ 20px)
        mb: 2.5,               // 각 게시글 아이템 사이의 하단 마진 (20px)
        bgcolor: 'background.paper', // 테마의 paper 배경색 사용
        borderRadius: 2,         // 테마 기반 모서리 둥글기 (예: 8px)
        // border: (theme) => `1px solid ${theme.palette.divider}`, // 필요하다면 테두리 추가
      }}
    >
      {/* 게시글 헤더 (제목) */}
      <Box sx={{ mb: 1.5 }}> {/* 내용과의 하단 간격 */}
        <Typography
          variant="h6" // 제목에 적합한 크기 (예: 20px 정도)
          component="h3" // HTML 시맨틱 태그는 h3로 유지
          sx={{
            fontWeight: 'bold',       // 제목 굵게
            color: 'text.primary',    // 테마의 주요 텍스트 색상
            wordBreak: 'break-word',  // 긴 제목이 레이아웃을 깨지 않도록 단어 단위 줄바꿈
          }}
        >
          {postItem.title || "제목 없음"} {/* 제목이 없을 경우 대비 */}
        </Typography>
      </Box>

      {/* 게시글 내용 */}
      <Typography
        variant="body1" // 본문 내용에 적합한 크기
        component="p"     // HTML p 태그로 렌더링
        sx={{
          color: 'text.secondary',  // 약간 연한 텍스트 색상
          whiteSpace: 'pre-wrap', // 입력된 줄바꿈 및 공백 유지
          wordBreak: 'break-word',  // 긴 내용이 레이아웃을 깨지 않도록
          mb: 2,                    // 푸터와의 하단 간격
          minHeight: '60px',        // 내용이 적더라도 최소 높이 확보 (선택 사항)
        }}
      >
        {postItem.content || "내용 없음"} {/* 내용이 없을 경우 대비 */}
      </Typography>

      <Divider sx={{ mb: 1.5 }} /> {/* 내용과 푸터 사이의 구분선 */}

      {/* 게시글 푸터 (작성자, 작성일) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // 양쪽 끝으로 정렬
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {postItem.authorName || "익명"} {/* 작성자 이름이 없을 경우 대비 */}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {formatDateTime(postItem.createdAt)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FreePostItem;