// src/components/comments/CommentSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Divider, Button, List, Paper } from '@mui/material';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import axios from 'axios';

const API_BASE_URL = '/api'; // Vite 프록시 사용 가정

const CommentSection = ({ targetId, currentUserId, currentUserAvatarUrl, currentUserNickname, isCommentingDisabled = false }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);      // 댓글 목록 로딩 상태
  const [isLoadingForm, setIsLoadingForm] = useState(false); // 댓글 폼(작성/수정) 제출 로딩 상태
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null); // 현재 수정 중인 댓글 객체
  const [showMainForm, setShowMainForm] = useState(true);     // 기본 새 댓글 작성 폼 표시 여부

  // 댓글 목록 불러오기 함수 (실제 API 호출)
  const fetchComments = useCallback(async () => {
    if (!targetId) {
      setComments([]);
      console.warn("[CommentSection] targetId is missing. Cannot fetch comments.");
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log(`[CommentSection] Fetching comments for targetId: ${targetId}`);
    try {
      const response = await axios.get(`${API_BASE_URL}/mateFoodPost/${targetId}/comments`);
      const fetchedComments = response.data.map(comment => ({
        id: comment.id,
        targetId: targetId,
        authorId: comment.writer, // TODO: 백엔드에서 실제 authorId 필드 제공 시 그것으로 교체
        authorName: comment.writer,
        avatarUrl: comment.avatarUrl || currentUserAvatarUrl || `https://via.placeholder.com/40/9E9E9E/FFFFFF?Text=${(comment.writer || "G").charAt(0)}`, // TODO: 백엔드에서 사용자별 아바타 제공 시 그것으로 교체
        content: comment.content,
        createdAt: comment.createdAt || new Date().toISOString(), // 백엔드 응답에 createdAt 포함 필수
      }));
      const sortedComments = fetchedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sortedComments);
    } catch (err) {
      console.error("댓글 로딩 API 호출 실패:", err.response || err.message || err);
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [targetId, currentUserAvatarUrl]); // currentUserAvatarUrl은 임시 아바타 매핑에 영향

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 새 댓글 추가 핸들러 (실제 API 호출)
  const handleAddComment = async (commentText) => {
    if (!targetId) { /* ... 이전과 동일한 null 체크 ... */ return; }
    if (!currentUserNickname || currentUserNickname.trim() === "") { /* ... 이전과 동일한 null 체크 ... */ return; }

    setIsLoadingForm(true); setError(null);
    try {
      const newCommentPayload = {
        writer: currentUserNickname, // 실제 로그인 사용자 닉네임
        content: commentText,
      };
      console.log("[CommentSection] 새 댓글 작성 요청:", newCommentPayload, "targetId:", targetId);
      await axios.post(`${API_BASE_URL}/mateFoodPost/${targetId}/comments`, newCommentPayload);
      fetchComments(); // 성공 후 목록 새로고침
      alert("댓글이 성공적으로 등록되었습니다!");
    // eslint-disable-next-line no-unused-vars
    } catch (err) { /* ... 이전과 동일한 에러 처리 ... */ }
    finally { setIsLoadingForm(false); }
  };

  // 댓글 수정 시작 핸들러 (UI 로직)
  const handleEditCommentStart = (commentToEdit) => {
    setEditingComment(commentToEdit);
    setShowMainForm(false); // 새 댓글 폼 숨김
  };

  // 댓글 수정 제출 핸들러 (실제 API 호출)
  const handleUpdateComment = async (commentId, updatedText) => {
    if (!targetId || !commentId) {
      console.error("targetId 또는 commentId가 없어 댓글을 수정할 수 없습니다.");
      alert("댓글 수정 중 오류가 발생했습니다. (ID 정보 누락)");
      return;
    }
    setIsLoadingForm(true); setError(null);
    try {
      // 백엔드 CommentRequestDto 형식에 맞춤 (writer는 보통 수정 안 함)
      const updatePayload = {
        content: updatedText,
        writer: editingComment?.writer || currentUserNickname, // 기존 작성자 정보 유지 또는 현재 사용자 (백엔드에서 권한 검증)
      };
      console.log(`[CommentSection] 댓글 수정 요청 (ID: ${commentId}):`, updatePayload);

      // ❗️ 실제 백엔드 댓글 수정 API 호출
      await axios.put(`${API_BASE_URL}/mateFoodPost/${targetId}/comments/${commentId}`, updatePayload);
      
      fetchComments(); // 성공 후 목록 새로고침
      setEditingComment(null); // 수정 상태 해제
      setShowMainForm(true);   // 기본 댓글 작성 폼 다시 표시
      alert("댓글이 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("댓글 수정 API 호출 실패:", err.response || err.message || err);
      const apiErrorMessage = err.response?.data?.message || err.response?.data || err.message || "댓글 수정 중 서버 오류가 발생했습니다.";
      setError(apiErrorMessage);
      alert(`댓글 수정 실패: ${apiErrorMessage}`);
    } finally {
      setIsLoadingForm(false);
    }
  };

  // 댓글 삭제 핸들러 (실제 API 호출)
  const handleDeleteComment = async (commentIdToDelete) => {
    if (!targetId) { /* ... 이전과 동일한 null 체크 ... */ return; }
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      setIsLoading(true); setError(null); // 목록 전체에 영향이 갈 수 있으므로 setIsLoading 사용
      try {
        await axios.delete(`${API_BASE_URL}/mateFoodPost/${targetId}/comments/${commentIdToDelete}`);
        fetchComments();
        alert("댓글이 성공적으로 삭제되었습니다.");
      } catch (err) {
        console.error("댓글 삭제 API 호출 실패:", err.response || err.message || err);
        const apiErrorMessage = err.response?.data?.message || err.response?.data || err.message || "댓글 삭제 중 서버 오류가 발생했습니다.";
        setError(apiErrorMessage);
        alert(`댓글 삭제 실패: ${apiErrorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // 수정 취소 핸들러
  const cancelEdit = () => {
    setEditingComment(null);
    setShowMainForm(true);
  };

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
        댓글 ({comments.length})
      </Typography>

      {/* 댓글 작성/수정 폼 */}
      {!isCommentingDisabled && editingComment ? ( // 수정 모드
        <CommentForm
          key={`edit-${editingComment.id}`}
          currentUserAvatarUrl={currentUserAvatarUrl}
          initialText={editingComment.content}
          onSubmit={(text) => handleUpdateComment(editingComment.id, text)} // ❗️ 수정 핸들러 연결
          submitLabel="수정 완료"
          placeholder="댓글 수정..."
          isLoading={isLoadingForm}
          onCancel={cancelEdit} // 수정 취소 함수 전달
        />
      ) : !isCommentingDisabled && showMainForm ? ( // 새 댓글 작성 모드
        <CommentForm
          currentUserAvatarUrl={currentUserAvatarUrl}
          onSubmit={handleAddComment}
          submitLabel="댓글 등록"
          isLoading={isLoadingForm}
        />
      ) : isCommentingDisabled ? ( // 댓글 작성 불가 시 메시지
        <Paper sx={{p:2, textAlign:'center', bgcolor:'action.disabledBackground', borderRadius:1.5, mb:2}}>
            <Typography variant="body2" color="text.disabled">
                모집이 완료되어 더 이상 댓글을 작성할 수 없습니다.
            </Typography>
        </Paper>
      ) : null } {/* 그 외 (예: 새 댓글 작성 버튼을 별도로 두는 경우) */}

      <Divider sx={{ my: 3 }} />

      {/* 로딩 및 에러 메시지 UI */}
      {isLoading && comments.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, gap: 1 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">댓글 로딩 중...</Typography>
        </Box>
      )}
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{mb:2}}>{error}</Alert>}

      {/* 댓글 목록 */}
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
              comment={comment} // 매핑된 댓글 객체 전달
              currentUserId={currentUserId}
              onEdit={handleEditCommentStart}  // 수정 시작 핸들러 연결
              onDelete={handleDeleteComment} // 삭제 함수 연결
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default CommentSection;