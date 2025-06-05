// src/components/comments/CommentSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Divider, Button, List, Paper } from '@mui/material';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import axios from 'axios';

const API_BASE_URL = '/api';

const CommentSection = ({ targetId, targetType, currentUserId, currentUserAvatarUrl, currentUserNickname, isCommentingDisabled = false }) => {
  // 모든 useState, useEffect, useCallback 등 Hook은 컴포넌트 최상위에서 선언되어야 합니다.
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [showMainForm, setShowMainForm] = useState(true);

  // currentUserId와 currentUserNickname의 안정적인 상태 관리
  const [ _stableUserId, setStableUserId ] = useState(null);
  const [ _stableUserNickname, setStableUserNickname ] = useState(null);
  const [ _stableUserAvatarUrl, setStableUserAvatarUrl ] = useState(null);

  // prop으로 받은 currentUserId가 유효해질 때만 내부 안정화 상태를 업데이트
  // prop이 undefined인 경우, localStorage에서 직접 읽어오는 대체 로직 추가
  useEffect(() => {
    let finalUserId = currentUserId;
    let finalNickname = currentUserNickname;
    let finalAvatarUrl = currentUserAvatarUrl;

    // prop이 undefined/null인 경우 localStorage에서 읽어오는 대체 로직
    if (!currentUserId || isNaN(Number(currentUserId))) {
      const storedId = localStorage.getItem("currentUserId");
      const storedNickname = localStorage.getItem("currentUserNickname");
      const storedAvatar = localStorage.getItem("currentUserAvatarUrl");

      if (storedId && !isNaN(Number(storedId))) {
        finalUserId = Number(storedId);
        finalNickname = storedNickname;
        finalAvatarUrl = storedAvatar;
      } else {
        finalUserId = null; // localStorage에도 없으면 null
        finalNickname = null;
        finalAvatarUrl = null;
      }
    }

    // 최종적으로 유효한 ID가 있을 때만 상태 업데이트
    if (finalUserId !== null && !isNaN(Number(finalUserId))) {
      setStableUserId(finalUserId);
      setStableUserNickname(finalNickname);
      setStableUserAvatarUrl(finalAvatarUrl);
    } else {
      setStableUserId(null);
      setStableUserNickname(null);
      setStableUserAvatarUrl(null);
    }
  }, [currentUserId, currentUserNickname, currentUserAvatarUrl]); // 이 props들이 변경될 때마다 useEffect 실행

  // 이제 isUserIdValid와 numericCurrentUserId는 _stableUserId를 기준으로 판단
  const isUserIdValid = _stableUserId !== null; // _stableUserId가 null이 아니면 유효
  const numericCurrentUserId = _stableUserId; // _stableUserId가 숫자로 보장되므로 그대로 사용

  const fetchComments = useCallback(async () => {
    if (!targetId || !targetType) {
      setComments([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/comments/byTarget/${targetType}/${targetId}`,
        {
          params: {
            currentKakaoUserId: numericCurrentUserId
          }
        }
      );
      const fetchedComments = response.data.map(comment => ({
        id: comment.id,
        targetId: comment.targetId,
        authorId: comment.kakaoUserId,
        authorName: comment.writerNickname,
        avatarUrl: comment.writerAvatarUrl || `https://via.placeholder.com/40/9E9E9E/FFFFFF?Text=${(comment.writerNickname || "G").charAt(0)}`,
        content: comment.content,
        createdAt: comment.createdAt,
        isAuthor: comment.isAuthor
      }));
      const sortedComments = fetchedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sortedComments);
    } catch (err) {
      console.error("댓글 로딩 API 호출 실패:", err.response || err.message || err);
      const apiErrorMessage = err.response?.data?.message || err.response?.data || err.message || "댓글을 불러오는 중 서버 오류가 발생했습니다.";
      setError(apiErrorMessage);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [targetId, targetType, numericCurrentUserId]); // numericCurrentUserId는 이제 항상 존재하므로 의존성 배열에 안전하게 추가

  useEffect(() => {
    // fetchComments 호출 전 _stableUserId가 유효한지 확인
    if (_stableUserId !== null && targetId && targetType) {
      fetchComments();
    }
  }, [_stableUserId, targetId, targetType, fetchComments]); // 의존성 배열에 fetchComments 추가

  const handleAddComment = useCallback(async (commentText) => {
    // isUserIdValid는 이제 Hook 선언 후에 사용되므로 문제 없음
    if (!isUserIdValid) {
      alert("⚠️ 오류: 사용자 정보가 유효하지 않아 댓글을 작성할 수 없습니다. 다시 로그인해주세요.");
      return;
    }
    if (!targetId || !targetType) {
      alert("댓글 작성 중 오류가 발생했습니다. (대상 정보 누락)");
      return;
    }
    if (!commentText.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    setIsLoadingForm(true);
    setError(null);
    try {
      const newCommentPayload = {
        content: commentText,
        targetId: Number(targetId),
        targetType: targetType,
        kakaoUserId: numericCurrentUserId,
        // 백엔드 CommentDto에 writerNickname과 writerAvatarUrl이 포함되어 있다면 여기도 추가해야 합니다.
        // writerNickname: _stableUserNickname,
        // writerAvatarUrl: _stableUserAvatarUrl,
      };

      // ❗️❗️❗️ 디버깅용 로그 추가 ❗️❗️❗️
      console.log("[CommentSection] 전송할 댓글 페이로드:", newCommentPayload);
      console.log("[CommentSection] 전송될 kakaoUserId:", numericCurrentUserId);


      await axios.post(`${API_BASE_URL}/comments`, newCommentPayload);
      
      fetchComments();
    } catch (err) {
      console.error("댓글 작성 API 호출 실패:", err.response || err.message || err);
      const apiErrorMessage = err.response?.data?.message || err.response?.data || err.message || "댓글 작성 중 서버 오류가 발생했습니다.";
      setError(apiErrorMessage);
      alert(`댓글 작성 실패: ${apiErrorMessage}`);
    } finally {
      setIsLoadingForm(false);
    }
  }, [isUserIdValid, targetId, targetType, numericCurrentUserId, fetchComments, _stableUserNickname, _stableUserAvatarUrl]); // 의존성 배열 업데이트

  const handleEditCommentStart = useCallback((commentToEdit) => {
    setEditingComment(commentToEdit);
    setShowMainForm(false);
  }, []);

  const handleUpdateComment = useCallback(async (commentId, updatedText) => {
    if (!isUserIdValid) {
      alert("⚠️ 오류: 사용자 정보가 유효하지 않아 댓글을 수정할 수 없습니다. 다시 로그인해주세요.");
      return;
    }
    if (!targetId || !commentId || !targetType) {
      alert("댓글 수정 중 오류가 발생했습니다. (정보 누락)");
      return;
    }
    if (!updatedText.trim()) {
        alert("수정할 댓글 내용을 입력해주세요.");
        return;
    }

    setIsLoadingForm(true); setError(null);
    try {
      const updatePayload = { content: updatedText, };
      await axios.put(
        `${API_BASE_URL}/comments/${commentId}`, updatePayload,
        { params: { kakaoUserId: numericCurrentUserId } }
      );
      fetchComments(); setEditingComment(null); setShowMainForm(true); alert("댓글이 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("댓글 수정 API 호출 실패:", err.response || err.message || err);
      const apiErrorMessage = err.response?.data?.message || err.response?.data || err.message || "댓글 수정 중 서버 오류가 발생했습니다.";
      setError(apiErrorMessage);
      alert(`댓글 수정 실패: ${apiErrorMessage}`);
    } finally {
      setIsLoadingForm(false);
    }
  }, [isUserIdValid, targetId, targetType, numericCurrentUserId, fetchComments]);


  const handleDeleteComment = useCallback(async (commentIdToDelete) => {
    if (!isUserIdValid) {
      alert("⚠️ 오류: 사용자 정보가 유효하지 않아 댓글을 삭제할 수 없습니다. 다시 시도해주세요.");
      return;
    }
    if (!targetId || !targetType || !commentIdToDelete) {
      alert("댓글 삭제 중 오류가 발생했습니다. (정보 누락)");
      return;
    }
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      setIsLoading(true); setError(null);
      try {
        await axios.delete(
          `${API_BASE_URL}/comments/${commentIdToDelete}`,
          { params: { kakaoUserId: numericCurrentUserId } }
          // KakaoUserId를 query param으로 보내는 경우
          // { data: { kakaoUserId: numericCurrentUserId } } // body로 보내는 경우
        );
        fetchComments(); alert("댓글이 성공적으로 삭제되었습니다.");
      } catch (err) {
        console.error("댓글 삭제 API 호출 실패:", err.response || err.message || err);
        const apiErrorMessage = err.response?.data?.message || err.response?.data || err.message || "댓글 삭제 중 서버 오류가 발생했습니다.";
        setError(apiErrorMessage);
        alert(`댓글 삭제 실패: ${apiErrorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isUserIdValid, targetId, targetType, numericCurrentUserId, fetchComments]);
  
  const cancelEdit = useCallback(() => { setEditingComment(null); setShowMainForm(true); }, []);

  // 사용자 정보가 유효하지 않을 때의 렌더링은 이제 모든 Hook이 호출된 후에 발생합니다.
  if (!isUserIdValid) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>사용자 정보를 불러오는 중이거나 로그인이 필요합니다.</Typography>
        <CircularProgress size={20} sx={{ mt: 1 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
        댓글 ({comments.length})
      </Typography>

      {/* 댓글 작성/수정 폼 */}
      {isUserIdValid && !isCommentingDisabled && editingComment ? ( // 수정 모드
        <CommentForm
          key={`edit-${editingComment.id}`} currentUserAvatarUrl={_stableUserAvatarUrl}
          initialText={editingComment.content} onSubmit={(text) => handleUpdateComment(editingComment.id, text)}
          submitLabel="수정 완료" placeholder="댓글 수정..." isLoading={isLoadingForm} onCancel={cancelEdit}
        />
      ) : isUserIdValid && !isCommentingDisabled && showMainForm ? ( // 새 댓글 작성 모드
        <CommentForm
          currentUserAvatarUrl={_stableUserAvatarUrl} onSubmit={handleAddComment}
          submitLabel="댓글 등록" isLoading={isLoadingForm}
        />
      ) : isCommentingDisabled ? ( // 댓글 작성 불가 시 메시지
        <Paper sx={{p:2, textAlign:'center', bgcolor:'action.disabledBackground', borderRadius:1.5, mb:2}}>
            <Typography variant="body2" color="text.disabled">모집이 완료되어 더 이상 댓글을 작성할 수 없습니다.</Typography>
        </Paper>
      ) : ( // isUserIdValid가 false이고 다른 조건도 아닐 때
        <Paper sx={{p:2, textAlign:'center', bgcolor:'action.disabledBackground', borderRadius:1.5, mb:2}}>
            <Typography variant="body2" color="text.disabled">로그인이 필요하거나 사용자 정보를 불러오는 중입니다.</Typography>
        </Paper>
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
              currentUserId={_stableUserId}
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