// src/components/comments/CommentItem.jsx (새로운 폴더 comments 안에 생성한다고 가정)
import React from 'react';
import { Box, Typography, Avatar, IconButton, Paper, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // '더보기' 아이콘
import { formatDistanceToNowStrict } from 'date-fns'; // 시간 표기를 위해 (예: "5분 전")
import { ko } from 'date-fns/locale'; // 한국어 로케일

// 댓글 데이터 예시: { id, authorName, avatarUrl, content, createdAt, authorId }
// currentUserId: 현재 로그인한 사용자 ID (자신의 댓글인지 판단하여 수정/삭제 버튼 표시용)
const CommentItem = ({ comment, currentUserId, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(comment); // 부모에게 수정할 댓글 정보 전달
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(comment.id); // 부모에게 삭제할 댓글 ID 전달
    handleMenuClose();
  };

  // 작성 시간 "얼마 전" 형태로 표시
  const timeAgo = comment.createdAt
    ? formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true, locale: ko })
    : '시간 정보 없음';

  const isOwnComment = comment.authorId === currentUserId; // 자신의 댓글인지 여부

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default', borderRadius: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Avatar
          alt={comment.authorName || '익명'}
          src={comment.avatarUrl /* || 기본 이미지 URL */}
          sx={{ width: 36, height: 36, mt: 0.5 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle2" component="strong" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {comment.authorName || '익명'}
            </Typography>
            {/* 자신의 댓글인 경우에만 더보기(수정/삭제) 메뉴 표시 */}
            {isOwnComment && (
              <>
                <IconButton
                  aria-label="comment-actions"
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ p:0.5 }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleEdit}>수정</MenuItem>
                  <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>삭제</MenuItem>
                </Menu>
              </>
            )}
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {comment.content}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.75 }}>
            {timeAgo}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentItem;