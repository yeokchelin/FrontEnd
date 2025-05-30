// src/components/freeboard/FreePostForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

export default function FreePostForm({ onPostSuccess, editingPost, cancelEdit }) {
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    if (editingPost) {
      setAuthorName(editingPost.writer);
      setPostTitle(editingPost.title);
      setPostContent(editingPost.content);
    } else {
      setAuthorName('');
      setPostTitle('');
      setPostContent('');
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authorName || !postTitle || !postContent) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const postData = {
      writer: authorName,
      title: postTitle,
      content: postContent,
    };

    try {
      if (editingPost) {
        await axios.put(`http://localhost:8080/api/freeboard/${editingPost.id}`, postData);
      } else {
        await axios.post("http://localhost:8080/api/freeboard", postData);
      }
      onPostSuccess();
    } catch (error) {
      console.error("게시글 저장 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: '700px',
        width: '100%',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" align="center">
        {editingPost ? "게시글 수정" : "새 게시글 작성"}
      </Typography>

      <TextField
        label="작성자 닉네임"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="제목"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="내용"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        required
        fullWidth
        multiline
        rows={4}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {editingPost && (
          <Button variant="outlined" onClick={cancelEdit}>
            취소
          </Button>
        )}
        <Button type="submit" variant="contained" color="primary">
          {editingPost ? "수정 완료" : "작성"}
        </Button>
      </Box>
    </Paper>
  );
}
