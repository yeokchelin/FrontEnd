// src/components/freeboard/FreePostForm.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
// './FreePostForm.css' 임포트는 더 이상 필요 없습니다.

export default function FreePostForm({ onAddPost }) {
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!authorName || !postTitle || !postContent) {
      alert('작성자, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    const newPost = {
      id: Date.now(), // 고유 ID
      authorName,
      title: postTitle,
      content: postContent,
      createdAt: new Date().toISOString(), // 작성 시간
    };

    onAddPost(newPost);

    // 폼 초기화
    setAuthorName('');
    setPostTitle('');
    setPostContent('');
  };

  return (
    <Paper
      component="form" // Paper 컴포넌트를 HTML form 태그로 렌더링
      onSubmit={handleSubmit}
      elevation={3} // 폼에 약간의 그림자 효과를 줍니다.
      sx={{
        p: { xs: 2, sm: 3, md: 4 }, // 반응형 패딩
        mt: 4, // 페이지 상단과의 간격
        mb: 4, // 페이지 하단과의 간격
        maxWidth: '700px', // 폼의 최대 너비
        ml: 'auto', // 좌우 마진을 auto로 주어 페이지 중앙에 위치 (부모가 block일 경우)
        mr: 'auto',
        bgcolor: 'background.paper', // 테마의 paper 배경색 사용 (다크/라이트 모드 자동 적용)
        borderRadius: 2, // 테마 기반 모서리 둥글기 (예: 8px)
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5, // 각 입력 필드 및 버튼 사이의 간격 (theme.spacing(2.5))
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        새 게시글 작성
      </Typography>

      <TextField
        label="작성자 닉네임" // placeholder 대신 label 사용 (MUI 스타일)
        id="authorName" // label과 input 연결
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required // HTML5 기본 유효성 검사
        fullWidth // 사용 가능한 전체 너비 차지
        variant="outlined" // 표준 테두리 스타일
      />

      <TextField
        label="제목"
        id="postTitle"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />

      <TextField
        label="내용"
        id="postContent"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        required
        fullWidth
        multiline // 여러 줄 입력 가능
        rows={5} // 기본 표시 줄 수
        variant="outlined"
      />

      <Button
        type="submit"
        variant="contained" // 배경색이 채워진 버튼 스타일
        color="primary"     // 테마의 primary 색상 사용
        size="large"        // 버튼 크기를 'large'로 설정
        sx={{
          mt: 1, // 위쪽 요소와의 간격
          // py: 1.5, // 필요시 버튼의 상하 패딩 직접 조절
          // fontSize: '1rem', // 필요시 폰트 크기 직접 조절
        }}
      >
        게시글 작성
      </Button>
    </Paper>
  );
};