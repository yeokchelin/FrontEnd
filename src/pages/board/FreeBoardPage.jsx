// src/pages/board/FreeBoardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Divider, Button, Paper, CircularProgress, Alert,
  Modal, IconButton
} from '@mui/material';
import FreePostList from '../../components/freeboard/FreePostList';
import FreePostForm from '../../components/freeboard/FreePostForm';
import CommentSection from '../../components/comments/CommentSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const API_BASE_URL = '/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%', md: '700px' },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 2,
  outline: 'none',
};

// FreePostDetailView 컴포넌트는 현재 사용되지 않는 것으로 보이지만, 일단 유지합니다.
const FreePostDetailView = ({ post, onBackToList, currentUserId, currentUserAvatarUrl, currentUserNickname }) => {
  const formatDate = (isoString) => {
    if (!isoString) return '날짜 정보 없음';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: 'lg', mx: 'auto', bgcolor: 'background.paper', borderRadius: 2 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onBackToList} sx={{ mb: 2 }}>
        목록으로 돌아가기
      </Button>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        {post.title}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          작성자: {post.writer || '익명'}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          작성일: {formatDate(post.createdAt)}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.7, mb: 4 }}>
        {post.content}
      </Typography>

      <CommentSection
        targetId={post.id ? post.id.toString() : ''}
        targetType="FREE_BOARD_POST"
        currentUserId={currentUserId}
        currentUserNickname={currentUserNickname}
        currentUserAvatarUrl={currentUserAvatarUrl}
      />
    </Paper>
  );
};


const FreeBoardPage = ({ currentUserId, currentUserNickname, currentUserAvatarUrl }) => {
  // 상태 변수들
  const [freePostList, setFreePostList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openCommentsModal, setOpenCommentsModal] = useState(false);
  const [postForCommentsModal, setPostForCommentsModal] = useState(null);

  // 게시글 목록을 불러오는 함수
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/freeboard/posts`);
      if (response.data && Array.isArray(response.data)) {
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFreePostList(sortedPosts);
      } else {
        setFreePostList([]);
      }
    } catch (err) {
      console.error("[FreeBoardPage] fetchPosts: 게시글 목록 로딩 실패:", err.response || err.message || err);
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
      setFreePostList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 게시글 불러오기
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 게시글 작성/수정/삭제 성공 시 목록 새로고침
  const handlePostSuccess = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 댓글 모달 열기
  const handleOpenCommentsModal = useCallback((post) => {
    const numericCurrentUserId = Number(currentUserId);
    // currentUserId 유효성 검사 (로그인 상태 등)
    if (!currentUserId || isNaN(numericCurrentUserId)) {
        alert("로그인이 필요하거나 사용자 정보를 불러오는 중입니다. 다시 시도해주세요.");
        return;
    }

    // post 객체와 post.id 유효성 검사
    if (post && post.id) {
      setPostForCommentsModal(post);
      setOpenCommentsModal(true);
    } else {
      console.warn("[FreeBoardPage] handleOpenCommentsModal: 게시글 정보 (ID)가 유효하지 않아 댓글 모달을 열 수 없습니다. Post:", post);
      alert("댓글을 불러오기 위한 게시글 정보가 유효하지 않습니다.");
    }
  }, [currentUserId]);

  // 댓글 모달 닫기
  const handleCloseCommentsModal = useCallback(() => {
    setOpenCommentsModal(false);
    setPostForCommentsModal(null);
  }, []);

  // 로딩 중 UI
  if (isLoading && freePostList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>게시글 목록을 불러오는 중... 📝</Typography>
      </Box>
    );
  }

  // 에러 발생 시 UI
  if (error) {
    return (
      <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', mt: 4 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
        <Button onClick={fetchPosts} sx={{ mt: 2 }} variant="outlined">다시 시도</Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2.5, sm: 3 },
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'medium' }}
      >
        자유 게시판
      </Typography>

      {/* 게시글 작성 폼 */}
      <FreePostForm
        onPostSuccess={handlePostSuccess}
        currentUserId={currentUserId}
        currentUserNickname={currentUserNickname}
      />

      <Divider sx={{ width: '100%', maxWidth: '700px', my: 2 }} />
      
      {/* 게시글이 없을 때 메시지 */}
      {freePostList.length === 0 && !isLoading && !error && (
        <Paper sx={{p:3, textAlign:'center', width:'100%', maxWidth:'700px', mt:2}}>
          <Typography color="text.secondary">표시할 게시글이 없습니다. 새 글을 작성해보세요!</Typography>
        </Paper>
      )}

      {/* 게시글 목록 */}
      {freePostList.length > 0 && (
        <FreePostList
          postList={freePostList}
          onEdit={(post) => { console.log("[FreeBoardPage] FreePostList: Edit 요청 (기능 미구현)", post); }}
          onDelete={handlePostSuccess}
          onPostClick={handleOpenCommentsModal} // FreePostItem 클릭 시 handleOpenCommentsModal 호출
        />
      )}

      {/* 댓글 모달 렌더링 */}
      <Modal
        open={openCommentsModal}
        onClose={handleCloseCommentsModal}
        aria-labelledby="comment-modal-title"
        aria-describedby="comment-modal-description"
      >
        <Box sx={modalStyle}>
          {/* CommentSection 렌더링 조건: postForCommentsModal, postForCommentsModal.id, currentUserId 모두 유효할 때 */}
          {postForCommentsModal && postForCommentsModal.id && currentUserId && !isNaN(Number(currentUserId)) ? (
            <>
              {/* 모달 헤더 - 닫기 버튼 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* ❗️❗️❗️ 이 부분을 수정했습니다. ❗️❗️❗️ */}
                <Typography id="comment-modal-title" variant="h6" component="h2">
                  {postForCommentsModal.title} {/* 이제 제목만 바로 표시됩니다. */}
                </Typography>
                <IconButton onClick={handleCloseCommentsModal} aria-label="닫기">
                  <span style={{ fontSize: '1.5rem', color: 'text.secondary' }}>&times;</span>
                </IconButton>
              </Box>
              
              {/* 게시글 상세 내용 (모달 내부에 보여줄 경우) */}
              <Typography variant="body2" color="text.secondary" sx={{mb:2}}>
                작성자: {postForCommentsModal.writer} | 작성일: {new Date(postForCommentsModal.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                {postForCommentsModal.content}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* 실제 CommentSection 컴포넌트 */}
              <CommentSection
                key={postForCommentsModal.id}
                targetId={postForCommentsModal.id.toString()}
                targetType="FREE_BOARD_POST"
                currentUserId={currentUserId}
                currentUserNickname={currentUserNickname}
                currentUserAvatarUrl={currentUserAvatarUrl}
              />
            </>
          ) : (
            // 조건이 충족되지 않을 때 표시할 메시지
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <Typography>사용자 정보를 불러오는 중이거나 댓글을 표시할 게시글 정보가 유효하지 않습니다.</Typography>
              <CircularProgress size={20} sx={{ mt: 1 }} />
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default FreeBoardPage;