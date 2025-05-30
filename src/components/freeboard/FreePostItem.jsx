// src/components/freeboard/FreePostItem.jsx
import React from 'react';
import { Paper, Typography, Box, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CommentSection from './CommentSection'; // ✅ 댓글 섹션 import

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false
  });
};

const FreePostItem = ({ postItem, onEdit, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:8080/api/freeboard/${postItem.id}`);
        onDelete(); // 목록 갱신
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
          {postItem.title}
        </Typography>
        <Box>
          <IconButton onClick={() => onEdit(postItem)}><EditIcon /></IconButton>
          <IconButton onClick={handleDelete}><DeleteIcon color="error" /></IconButton>
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          my: 2,
        }}
      >
        {postItem.content}
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">{postItem.writer || "익명"}</Typography>
        <Typography variant="caption">{formatDateTime(postItem.createdAt)}</Typography>
      </Box>

      <Divider sx={{ mt: 2, mb: 1 }} />

      {/* ✅ 댓글 섹션 추가 */}
      <CommentSection postId={postItem.id} />
    </Paper>
  );
};

export default FreePostItem;
