// src/components/freeboard/CommentSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:8080/api/comments/${postId}`, {
        writer: '익명', // 로그인 기능과 연동하면 사용자 정보로 대체 가능
        content: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>댓글</Typography>

      {comments.map((comment) => (
        <Paper key={comment.id} sx={{ p: 1.5, mb: 1, bgcolor: 'grey.100' }}>
          <Typography variant="body2">{comment.content}</Typography>
          <Typography variant="caption" color="text.secondary">
            {comment.writer || '익명'} · {new Date(comment.createdAt).toLocaleString('ko-KR')}
          </Typography>
        </Paper>
      ))}

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <TextField
          fullWidth
          label="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleSubmit}>등록</Button>
      </Box>
    </Box>
  );
};

export default CommentSection;
