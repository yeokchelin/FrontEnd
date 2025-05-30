// src/components/freeboard/FreePostItem.jsx
import React from 'react';
// ❗️ ListItemButton을 추가로 import 합니다. Paper를 클릭 가능하게 만들기 위해 사용합니다.
import { Paper, Typography, Box, Divider, ListItemButton } from '@mui/material';
// import { useTheme } from '@mui/material/styles'; // 현재 코드에서는 theme 객체를 직접 사용하지 않으므로 주석 처리 가능

// 날짜 포맷 함수 (이전과 동일)
const formatDateTime = (isoString) => {
  if (!isoString) return '날짜 정보 없음';
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

// ❗️ onPostClick prop을 새로 받습니다.
const FreePostItem = ({ postItem, onPostClick }) => {
  // const theme = useTheme(); // 현재 코드에서는 theme 객체를 직접 사용하지 않음

  if (!postItem) {
    return null;
  }

  // postItem의 필드명을 사용 (예: title, content, authorName, createdAt)
  // 자유게시판 데이터 구조에 맞게 필드명을 사용해야 합니다.
  const {
    title = "제목 없음",
    content = "내용 없음",
    authorName = "익명",
    createdAt,
    // id 등 다른 필요한 필드도 reviewItem에서 가져올 수 있습니다.
  } = postItem;


  return (
    // ❗️ Paper 컴포넌트에 component={ListItemButton}과 onClick 핸들러를 추가합니다.
    <Paper
      elevation={2}
      component={ListItemButton} // Paper를 클릭 가능한 버튼처럼 동작하게 합니다.
      onClick={() => onPostClick(postItem)} // 클릭 시 onPostClick 함수에 postItem 전체를 전달합니다.
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 2.5,
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: '100%', // 부모 Box 너비에 맞춤 (FreePostList에서 maxWidth 제어)
        textAlign: 'left', // ListItemButton 기본 스타일과 유사하게 왼쪽 정렬
        // cursor: 'pointer'는 ListItemButton에 의해 자동으로 적용됩니다.
        '&:hover': { // 호버 효과 (선택 사항)
          bgcolor: 'action.hover',
        },
      }}
    >
      {/* 게시글 헤더 (제목) - Box 제거하고 Typography만으로도 충분할 수 있음 */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          wordBreak: 'break-word',
          mb: 1, // 내용과의 간격
        }}
      >
        {title}
      </Typography>

      {/* 게시글 내용 (간략히 표시) */}
      <Typography
        variant="body2"
        component="p"
        sx={{
          color: 'text.secondary',
          whiteSpace: 'pre-wrap', // 또는 'nowrap'으로 하고 아래 말줄임표 스타일 적용
          wordBreak: 'break-word',
          lineHeight: 1.5,
          mb: 1.5,
          // 여러 줄 말줄임표 스타일 (내용이 길 경우)
          display: '-webkit-box',
          WebkitLineClamp: 2, // 최대 2줄까지 보이고 나머지는 ...
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '2.8em', // 약 2줄 높이 확보 (폰트 크기에 따라 조절)
        }}
      >
        {content}
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {/* 게시글 푸터 (작성자, 작성일) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1, // Divider와의 간격
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {authorName}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}> {/* 날짜는 더 연한 색으로 */}
          {formatDateTime(createdAt)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FreePostItem;