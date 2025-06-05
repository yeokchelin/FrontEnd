// src/components/comments/CommentForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar } from '@mui/material';

// currentUserAvatarUrl: 현재 로그인한 사용자 아바타 (선택 사항)
// initialText: 댓글 수정 시 기존 내용
// onSubmit: (text) => void 형태의 콜백 함수
// submitLabel: 버튼 텍스트 (예: "댓글 작성", "수정 완료")
// placeholder: TextField 플레이스홀더
// isLoading: 제출 버튼 로딩 상태
const CommentForm = ({ currentUserAvatarUrl, initialText = '', onSubmit, submitLabel = "댓글 작성", placeholder="댓글을 입력하세요...", isLoading = false }) => {
  const [commentText, setCommentText] = useState(initialText);

  // initialText가 변경되면 내부 상태도 업데이트 (댓글 수정 시 활용)
  useEffect(() => {
    setCommentText(initialText);
  }, [initialText]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    onSubmit(commentText); // 부모에게 텍스트 전달
    setCommentText(''); // 제출 후 텍스트 필드 초기화 (새 댓글 작성 시에만, 수정 시에는 부모가 관리)
    if (submitLabel === "댓글 작성") { // 새 댓글 작성 후에는 필드 초기화
        setCommentText('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'background.paper', borderRadius: 1.5 }}
    >
      <Avatar
        alt="Current User"
        src={currentUserAvatarUrl /* || 기본 사용자 아바타 */}
        sx={{ width: 40, height: 40, mt: 0.5 }}
      />
      <TextField
        fullWidth
        multiline
        minRows={2} // 최소 줄 수
        variant="outlined"
        placeholder={placeholder}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        InputProps={{
          sx: { borderRadius: '8px' } // 입력창 모서리 약간 둥글게
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading || !commentText.trim()} // 로딩 중이거나 내용 없으면 비활성화
        sx={{ ml: 1, height: 'fit-content', mt: 0.5, px: 2.5, py: 1.2 }}
      >
        {isLoading ? "처리 중..." : submitLabel}
      </Button>
    </Box>
  );
};

export default CommentForm;