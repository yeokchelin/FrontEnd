import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Divider } from '@mui/material';
import axios from 'axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comments/${postId}`);
      setComments(res.data);
    } catch (e) {
      console.error("댓글 조회 실패:", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!writer || !content) return alert("작성자와 내용을 모두 입력해주세요.");

    try {
      await axios.post(`http://localhost:8080/api/comments/${postId}`, { writer, content });
      setWriter('');
      setContent('');
      fetchComments();
    } catch (e) {
      alert("댓글 작성 실패");
      console.error(e);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h6" gutterBottom>댓글</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField label="작성자" size="small" value={writer} onChange={(e) => setWriter(e.target.value)} />
        <TextField label="댓글 내용" fullWidth size="small" value={content} onChange={(e) => setContent(e.target.value)} />
        <Button type="submit" variant="contained">등록</Button>
      </Box>

      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">아직 댓글이 없습니다.</Typography>
      ) : (
        comments.map(comment => (
          <Paper key={comment.id} sx={{ p: 2, mb: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{comment.content}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary">{comment.writer} | {comment.createdAt}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default CommentSection;
