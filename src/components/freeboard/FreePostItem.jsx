// src/components/freeboard/FreePostItem.jsx
import React from 'react';
import { Paper, Typography, Box, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
// CommentSection은 더 이상 여기서 임포트되지 않습니다.

const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false
  });
};

const FreePostItem = ({ post, onEdit, onDelete, onPostClick }) => {
  const handleDelete = async (event) => {
    event.stopPropagation(); // Paper의 onClick 이벤트 전파 방지
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        // ❗️❗️❗️ 여기가 수정될 부분입니다. ❗️❗️❗️
        // URL에 '/posts/' 경로를 추가해야 합니다.
        const deleteUrl = `http://localhost:8080/api/freeboard/posts/${post.id}`;
        console.log(`[FreePostItem] 삭제 요청 URL: ${deleteUrl}`); // 확인을 위한 로그 유지

        await axios.delete(deleteUrl);
        
        onDelete(); // 목록 갱신 (성공 시)
        console.log(`[FreePostItem] 게시글 ${post.id} 삭제 성공.`);
      } catch (error) {
        console.error("[FreePostItem] 삭제 실패:", error.response || error.message || error);
        alert("삭제 중 오류가 발생했습니다. 개발자 도구 콘솔을 확인해주세요.");
      }
    }
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    onEdit(post);
  };

  const handleItemClick = () => {
    if (onPostClick) {
      onPostClick(post);
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
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      onClick={handleItemClick}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ wordBreak: 'break-word', flexGrow: 1, pr: 1 }}>
          {post.title}
        </Typography>
        <Box sx={{ display: 'flex', flexShrink: 0 }}>
          <IconButton onClick={handleEditClick} aria-label="수정"><EditIcon /></IconButton>
          <IconButton onClick={handleDelete} aria-label="삭제"><DeleteIcon color="error" /></IconButton>
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
        {post.content}
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">{post.writer || "익명"}</Typography>
        <Typography variant="caption">{formatDateTime(post.createdAt)}</Typography>
      </Box>
    </Paper>
  );
};

export default FreePostItem;