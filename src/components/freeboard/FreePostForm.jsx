// src/components/freeboard/FreePostForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = '/api';

export default function FreePostForm({ onPostSuccess, editingPost, cancelEdit, currentUserId, currentUserNickname }) {
  const [writer, setWriter] = useState(''); // 백엔드의 'writer' 필드와 매칭
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 수정 모드일 때 기존 데이터 로드
    if (editingPost) {
      setWriter(editingPost.writer || currentUserNickname || '');
      setPostTitle(editingPost.title || '');
      setPostContent(editingPost.content || '');
    }
    // 새 글 작성 모드일 때 현재 사용자 닉네임으로 자동 채움
    else {
      setWriter(currentUserNickname || '');
      setPostTitle('');
      setPostContent('');
    }
    setError(null); // 폼 로드/모드 변경 시 에러 초기화
  }, [editingPost, currentUserNickname]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    // currentUserId 유효성 검사
    const numericCurrentUserId = Number(currentUserId);
    if (!currentUserId || isNaN(numericCurrentUserId)) {
      alert("로그인이 필요한 기능입니다. (유효한 사용자 ID 없음)");
      return;
    }

    // 필수 필드 유효성 검사
    if (!writer.trim() || !postTitle.trim() || !postContent.trim()) {
      alert('작성자, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postPayload = {
        writer: writer, // 작성자 닉네임
        title: postTitle,
        content: postContent,
        kakaoUserId: numericCurrentUserId, // ★★★ kakaoUserId 추가 ★★★
      };

      let response;
      if (editingPost) {
        // 수정 시에는 게시글 ID와 currentKakaoUserId를 쿼리 파라미터로 보냄
        response = await axios.put(`${API_BASE_URL}/freeboard/posts/${editingPost.id}?currentKakaoUserId=${currentUserId}`, postPayload);
        alert("게시글이 성공적으로 수정되었습니다!");
      } else {
        // 생성 시에는 본문에 kakaoUserId 포함 (백엔드 FreeBoardController의 /write 엔드포인트에 맞춰짐)
        response = await axios.post(`${API_BASE_URL}/freeboard/write`, postPayload);
        alert("새 게시글이 성공적으로 등록되었습니다!");
      }

      if (onPostSuccess) {
        onPostSuccess(); // 게시글 목록 새로고침
      }

      // 폼 초기화 또는 수정 모드 종료
      if (!editingPost) {
        setWriter(currentUserNickname || ''); // 새 글 작성 후 작성자 닉네임은 다시 자동 채움
        setPostTitle('');
        setPostContent('');
      } else {
        cancelEdit(); // 수정 모드 종료
      }

    } catch (err) {
      console.error("게시글 저장 오류:", err.response || err);
      const errorMessage = err.response?.data?.message || err.message || "게시글 저장 중 오류 발생";
      setError(errorMessage);
      alert(`게시글 저장 실패: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: { xs: 3, sm: 4, md: 5 }, // ✅ 패딩 증가
        my: { xs: 4, sm: 5, md: 6 }, // ✅ 상하 마진 증가
        width: '100%',
        maxWidth: '900px', // ✅ 최대 너비 증가 (더 크게 보이도록)
        mx: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 3, // ✅ 요소들 간의 간격 증가
      }}
    >
      <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}> {/* ✅ 폰트 크기, 굵기, 색상 강조 */}
        {editingPost ? '자유 게시글 수정' : '새 자유 게시글 작성'}
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 작성자 닉네임 필드 */}
      <TextField
        label="작성자 닉네임"
        id="writer" // authorName 대신 writer로 변경
        value={writer}
        required
        fullWidth
        variant="outlined"
        InputProps={{
          readOnly: true, // 사용자가 직접 수정 불가
        }}
        helperText="작성자 닉네임은 로그인 정보로 자동 입력됩니다."
        sx={{ mb: 1 }} // ✅ 하단 마진 추가
      />

      {/* 제목 필드 */}
      <TextField
        label="제목"
        id="postTitle"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        required
        fullWidth
        variant="outlined"
        disabled={loading}
        sx={{ mb: 1 }} // ✅ 하단 마진 추가
        InputProps={{ style: { fontSize: '1.1rem' } }} // ✅ 폰트 크기 증가
      />

      {/* 내용 필드 */}
      <TextField
        label="내용"
        id="postContent"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        required
        fullWidth
        multiline
        rows={8} // ✅ 높이 증가
        variant="outlined"
        disabled={loading}
        sx={{ mb: 2 }} // ✅ 하단 마진 증가
        InputProps={{ style: { fontSize: '1.05rem' } }} // ✅ 폰트 크기 증가
        placeholder="자세한 내용을 작성해주세요." // ✅ 플레이스홀더 추가
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ flexGrow: 1, py: 1.5 }} // ✅ 패딩 증가
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : (editingPost ? '수정 완료' : '게시글 작성')}
        </Button>
        {editingPost && (
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={cancelEdit}
            disabled={loading}
            sx={{ flexGrow: 1, py: 1.5 }} // ✅ 패딩 증가
          >
            취소
          </Button>
        )}
      </Box>
    </Paper>
  );
}