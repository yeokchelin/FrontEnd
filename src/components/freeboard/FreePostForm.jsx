// src/components/freeboard/FreePostForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = '/api';

export default function FreePostForm({ onPostSuccess, editingPost, cancelEdit, currentUserId, currentUserNickname }) {
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingPost) {
      setAuthorName(editingPost.writer || currentUserNickname || '');
      setPostTitle(editingPost.title || '');
      setPostContent(editingPost.content || '');
    } else {
      setAuthorName(currentUserNickname || '');
      setPostTitle('');
      setPostContent('');
    }
    setError(null);
  }, [editingPost, currentUserNickname]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    // ❗️❗️❗️ 여기에 로그를 추가합니다. ❗️❗️❗️
    console.log("FreePostForm: handleSubmit called.");
    console.log("FreePostForm: currentUserId prop value:", currentUserId, "Type:", typeof currentUserId);
    
    const numericCurrentUserId = Number(currentUserId);
    console.log("FreePostForm: numericCurrentUserId:", numericCurrentUserId, "isNaN(numericCurrentUserId):", isNaN(numericCurrentUserId));

    if (!currentUserId || isNaN(numericCurrentUserId)) {
      alert("로그인이 필요한 기능입니다. (유효한 사용자 ID 없음)");
      return;
    }

    if (!authorName.trim() || !postTitle.trim() || !postContent.trim()) {
      alert('작성자, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postPayload = {
        writer: authorName,
        title: postTitle,
        content: postContent,
      };

      let response;
      if (editingPost) {
        response = await axios.put(`${API_BASE_URL}/freeboard/posts/${editingPost.id}`, postPayload);
        alert("게시글이 성공적으로 수정되었습니다!");
      } else {
        response = await axios.post(`${API_BASE_URL}/freeboard/write`, postPayload);
        alert("새 게시글이 성공적으로 등록되었습니다!");
      }

      if (onPostSuccess) {
        onPostSuccess();
      }

      if (!editingPost) {
        setAuthorName(currentUserNickname || '');
        setPostTitle('');
        setPostContent('');
      } else {
        cancelEdit();
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
        p: { xs: 2, sm: 3, md: 4 },
        mt: 4,
        mb: 4,
        maxWidth: '700px',
        ml: 'auto',
        mr: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        {editingPost ? '게시글 수정' : '새 게시글 작성'}
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TextField
        label="작성자 닉네임"
        id="authorName"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
        fullWidth
        variant="outlined"
        disabled={loading || !!editingPost}
      />

      <TextField
        label="제목"
        id="postTitle"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        required
        fullWidth
        variant="outlined"
        disabled={loading}
      />

      <TextField
        label="내용"
        id="postContent"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        required
        fullWidth
        multiline
        rows={5}
        variant="outlined"
        disabled={loading}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ flexGrow: 1 }}
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
            sx={{ flexGrow: 1 }}
          >
            취소
          </Button>
        )}
      </Box>
    </Paper>
  );
}