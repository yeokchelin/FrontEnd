// src/components/comments/CommentSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Divider, Button, List } from '@mui/material';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
// import axios from 'axios'; // 실제 API 호출 시 다시 주석 해제

// const API_BASE_URL = '/api'; // 실제 API 호출 시 다시 주석 해제

// --- 임시 더미 데이터 저장소 ---
// targetId별로 댓글을 관리하기 위한 객체
let DUMMY_COMMENTS_STORE = {
  // 예시: "poll123": [ {id: 'c1', targetId: 'poll123', authorId: 'user1', authorName: '김댓글', avatarUrl: '', content: '첫 댓글입니다!', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()} ]
};
// --- 임시 더미 데이터 저장소 끝 ---


const CommentSection = ({ targetId, currentUserId, currentUserAvatarUrl }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [showMainForm, setShowMainForm] = useState(true);

  // 댓글 목록 불러오기 함수 (더미 데이터 사용)
  const fetchComments = useCallback(async () => {
    if (!targetId) return;

    setIsLoading(true);
    setError(null);
    console.log(`Fetching comments for targetId: ${targetId}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // API 호출 시뮬레이션

    try {
      const targetComments = DUMMY_COMMENTS_STORE[targetId] || [];
      const sortedComments = [...targetComments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sortedComments);
    } catch (err) {
      console.error("더미 댓글 로딩 실패:", err);
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 새 댓글 추가 핸들러 (더미 데이터 사용)
  const handleAddComment = async (commentText) => {
    if (!targetId) {
      alert("댓글을 작성할 대상이 지정되지 않았습니다.");
      return;
    }
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 300)); // API 호출 시뮬레이션

    try {
      const newComment = {
        id: `comment-${Date.now()}`, // 고유 ID 생성
        targetId,
        authorId: currentUserId || 'tempUser', // 실제로는 인증된 사용자 ID 사용
        authorName: "나 (테스트)", // 실제로는 인증된 사용자 이름 사용
        avatarUrl: currentUserAvatarUrl,
        content: commentText,
        createdAt: new Date().toISOString(),
      };

      if (!DUMMY_COMMENTS_STORE[targetId]) {
        DUMMY_COMMENTS_STORE[targetId] = [];
      }
      DUMMY_COMMENTS_STORE[targetId].push(newComment);
      
      fetchComments(); // 목록 새로고침
      setShowMainForm(true);
      // setEditingComment(null); // 새 댓글 작성 후 수정 상태는 아니므로
    } catch (err) {
      console.error("더미 댓글 작성 실패:", err);
      setError("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 수정 시작 핸들러
  const handleEditCommentStart = (commentToEdit) => {
    setEditingComment(commentToEdit);
    setShowMainForm(false); // 기본 작성 폼 숨기기 (수정 폼이 메인 폼을 대체)
  };

  // 댓글 수정 제출 핸들러 (더미 데이터 사용)
  const handleUpdateComment = async (commentId, updatedText) => {
    if (!targetId) return;
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      DUMMY_COMMENTS_STORE[targetId] = DUMMY_COMMENTS_STORE[targetId].map(c =>
        c.id === commentId ? { ...c, content: updatedText, updatedAt: new Date().toISOString() } : c
      );
      fetchComments();
      setEditingComment(null);
      setShowMainForm(true);
      alert("댓글이 수정되었습니다.");
    } catch (err) {
      console.error("더미 댓글 수정 실패:", err);
      setError("댓글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 삭제 핸들러 (더미 데이터 사용)
  const handleDeleteComment = async (commentId) => {
    if (!targetId) return;
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      setIsLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        DUMMY_COMMENTS_STORE[targetId] = DUMMY_COMMENTS_STORE[targetId].filter(c => c.id !== commentId);
        fetchComments();
        alert("댓글이 삭제되었습니다.");
      } catch (err) {
        console.error("더미 댓글 삭제 실패:", err);
        setError("댓글 삭제 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
        댓글 ({comments.length})
      </Typography>

      {editingComment ? (
        <>
          <Typography variant="body2" color="text.secondary" sx={{mb:1}}>댓글 수정:</Typography>
          <CommentForm
            key={`edit-${editingComment.id}`}
            currentUserAvatarUrl={currentUserAvatarUrl}
            initialText={editingComment.content}
            onSubmit={(text) => handleUpdateComment(editingComment.id, text)}
            submitLabel="수정 완료"
            placeholder="댓글 수정..."
            isLoading={isLoading}
          />
        </>
      ) : showMainForm ? (
        <CommentForm
          currentUserAvatarUrl={currentUserAvatarUrl}
          onSubmit={handleAddComment}
          submitLabel="댓글 작성"
          isLoading={isLoading}
        />
      ) : (
        // '댓글 작성하기' 버튼은 수정 중이 아닐 때, 그리고 메인 폼이 숨겨져 있을 때만 표시될 수 있음
        // 현재 로직에서는 editingComment가 있거나 showMainForm이 true이므로 이 버튼은 잘 안보일 수 있음.
        // 필요하다면 댓글 작성 폼을 항상 보이게 하거나, 별도의 토글 버튼을 둘 수 있습니다.
        <Button variant="outlined" onClick={() => { setShowMainForm(true); setEditingComment(null); }} sx={{mb:2}}>
          새 댓글 작성하기
        </Button>
      )}
      {editingComment && (
         <Button variant="text" size="small" onClick={() => { setEditingComment(null); setShowMainForm(true); }} sx={{mt:1, mb:2}}>
            수정 취소
        </Button>
      )}

      <Divider sx={{ my: 3 }} />

      {isLoading && comments.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, gap: 1 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">댓글 로딩 중...</Typography>
        </Box>
      )}
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{mb:2}}>{error}</Alert>}

      {!isLoading && comments.length === 0 && !error && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </Typography>
      )}

      {comments.length > 0 && (
        <List disablePadding>
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={handleEditCommentStart}
              onDelete={handleDeleteComment}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default CommentSection;