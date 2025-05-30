// src/components/freeboard/CommentSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // ✅ useCallback으로 감싼 fetchComments
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments(); // ✅ useCallback으로 인해 안전하게 의존성 배열에 포함 가능
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:8080/api/comments`, {
        postId,
        content: newComment
      });
      setNewComment('');
      fetchComments(); // 새 댓글 등록 후 다시 불러오기
    } catch (error) {
      console.error('댓글 작성 실패:', error);
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
