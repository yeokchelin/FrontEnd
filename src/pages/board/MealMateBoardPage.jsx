// src/pages/board/MealMateBoardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Divider, CircularProgress, Alert, Button,
  Paper, IconButton, Chip
} from '@mui/material';
import MealMatePostList from '../../components/mealmateboard/MealMatePostList';
import MealMatePostForm from '../../components/mealmateboard/MealMatePostForm';
import CommentSection from '../../components/comments/CommentSection'; // 댓글 섹션 임포트
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import WcIcon from '@mui/icons-material/Wc';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const API_BASE_URL = '/api'; // package.json의 "proxy" 설정을 사용하거나, 백엔드 실제 URL로 변경 가능

const formatFullDateTime = (isoString) => {
  if (!isoString) return '날짜 정보 없음';
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8, gap: 0.8 }}>
    {React.cloneElement(icon, { sx: { fontSize: '1.1rem', color: 'text.secondary' } })}
    <Typography variant="body2" component="span" sx={{ fontWeight: 'medium', color: 'text.secondary', whiteSpace: 'nowrap' }}>{label}:</Typography>
    <Typography variant="body2" component="span" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>{value}</Typography>
  </Box>
);

const MealMatePostDetailView = ({ post, onBackToList, currentUserId, currentUserAvatarUrl, currentUserNickname, onSetStatusCompleted, onEditPost }) => {
  const theme = useTheme();
  if (!post) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">게시글 정보를 불러올 수 없습니다.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={onBackToList} sx={{ mt: 2 }}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }
  const { id, title = "제목 없음", writer = "익명", meetingStation = "미정", meetingTime = "미정", content = "내용 없음", status = "정보 없음", recruitCount, preferredGender, createdAt } = post;
  const isRecruiting = status === '모집 중';
  const isAuthor = currentUserId === writer; // ❗️ 실제로는 고유 ID로 비교

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md:4 }, width: '100%', maxWidth: 'lg', mx: 'auto', bgcolor: 'background.paper', borderRadius: 2.5 }}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5}}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBackToList} sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover'} }}>목록으로 돌아가기</Button>
        {/* 상세 보기 내 수정 버튼 */}
        {isAuthor && (
          <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => onEditPost(post)} disabled={!isRecruiting} > 글 수정 </Button>
        )}
      </Box>
      <Chip label={status} color={isRecruiting ? "success" : "default"} size="small" sx={{ fontWeight: 'medium', mb:1, display:'block', width:'fit-content' }} />
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', wordBreak: 'break-word' }}>{title}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap:'wrap', gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">작성자: {writer}</Typography>
        <Typography variant="caption" color="text.disabled">작성일: {formatFullDateTime(createdAt)}</Typography>
      </Box>
      <Divider sx={{ mb: 2.5 }} />
      <Box sx={{ mb:3, p:2.5, bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', borderRadius:1.5 }}>
          <Typography variant="h6" gutterBottom sx={{fontWeight:'medium', color: 'text.primary', mb:1.5}}>모임 정보</Typography>
          <DetailItem icon={<LocationOnIcon />} label="만날 역" value={meetingStation} />
          <DetailItem icon={<AccessTimeIcon />} label="만날 시간" value={meetingTime} />
          <DetailItem icon={<GroupIcon />} label="모집 인원" value={`${recruitCount != null ? recruitCount : '?'}명`} />
          <DetailItem icon={<WcIcon />} label="선호 성별" value={preferredGender} />
      </Box>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.7, mb: 2 }}>{content}</Typography>
      {/* 상세 보기 내 모집 완료 버튼 */}
      {isAuthor && isRecruiting && typeof onSetStatusCompleted === 'function' && (
        <Box sx={{my: 2, display:'flex', justifyContent:'flex-end'}}>
            <Button variant="outlined" color="success" size="small" startIcon={<CheckCircleOutlineIcon />} onClick={() => onSetStatusCompleted(id)}>모집 완료로 변경</Button>
        </Box>
      )}
      <Divider sx={{ mb: 2.5 }} />
      <CommentSection
        targetId={id ? id.toString() : ''}
        currentUserId={currentUserId}
        currentUserAvatarUrl={currentUserAvatarUrl}
        currentUserNickname={currentUserNickname}
        isCommentingDisabled={!isRecruiting}
      />
    </Paper>
  );
};

const MealMateBoardPage = () => {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // ❗️ 이 값들은 실제 로그인 시스템과 연동되어야 합니다.
  // `postItem.writer`와 비교될 값입니다.
  const currentUserId = "테스트_밥친구"; // 예: "밥친구러버" 또는 실제 사용자 고유 ID
  const currentUserNickname = "테스트_밥친구"; // 댓글 작성 시 사용
  const currentUserAvatarUrl = "https://via.placeholder.com/40/4CAF50/FFFFFF?Text=U";

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/boardmatefood/posts`);
      if (response.data && Array.isArray(response.data)) {
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPostList(sortedPosts);
      } else {
        setPostList([]);
      }
    } catch (err) {
      console.error("게시글 목록 로딩 실패:", err.response || err.message || err);
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
      setPostList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedPost) {
      fetchPosts();
    }
  }, [selectedPost, fetchPosts]);

  const handleSavePost = async (formDataFromChild) => {
    const isEditMode = !!editingPost;
    const postPayload = {
      writer: currentUserNickname, // 새 글 작성 시 또는 수정 시 작성자 (백엔드에서 최종 결정)
      title: formDataFromChild.postTitle,
      content: formDataFromChild.postContent,
      meetingStation: formDataFromChild.meetingStation,
      meetingTime: formDataFromChild.meetingTime,
      recruitCount: Number(formDataFromChild.partySize),
      preferredGender: formDataFromChild.genderPreference,
      status: isEditMode ? (formDataFromChild.status || editingPost.status) : "모집 중",
    };
    setError(null);
    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/boardmatefood/posts/${editingPost.id}`, postPayload);
        alert("게시글이 성공적으로 수정되었습니다!");
      } else {
        await axios.post(`${API_BASE_URL}/boardmatefood/write`, postPayload);
        alert("게시글이 성공적으로 등록되었습니다!");
      }
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error(`게시글 ${isEditMode ? '수정' : '등록'} 실패:`, err.response || err);
      const errorMessage = err.response?.data?.message || err.message || `게시글 ${isEditMode ? '수정' : '등록'} 중 오류 발생`;
      setError(errorMessage);
      // alert(`게시글 ${isEditMode ? '수정' : '등록'} 실패: ${errorMessage}`); // 에러 Alert로 대체 가능
    }
  };
  
  const handleEditPost = (postToEdit) => {
    if (postToEdit.status !== '모집 중') {
        alert('모집이 완료된 게시글은 수정할 수 없습니다.');
        return;
    }
    setSelectedPost(null);     
    setEditingPost(postToEdit); 
    setShowForm(true);          
  };

  const handleDeletePost = async (postId) => {
    if (selectedPost && selectedPost.id === postId) {
        alert("상세 보기 중인 게시글은 목록에서 직접 삭제할 수 없습니다.\n목록으로 돌아가서 시도해주세요.");
        return;
    }
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
        setError(null);
        try {
            await axios.delete(`${API_BASE_URL}/boardmatefood/posts/${postId}`);
            fetchPosts();
            alert("게시글이 삭제되었습니다.");
        } catch (err) {
            console.error("게시글 삭제 실패:", err.response || err);
            const errorMessage = err.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다.";
            setError(errorMessage);
        }
    }
  };

  const handleSetStatusToCompleted = async (postId) => {
    setError(null);
    try {
      const payload = { status: "모집 완료" };
      const response = await axios.patch(`${API_BASE_URL}/boardmatefood/posts/${postId}/status`, payload);
      
      setPostList(prevList => prevList.map(p =>
        p.id === postId ? response.data : p
      ));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(response.data);
      }
      alert("모집 상태가 '모집 완료'로 변경되었습니다.");
    } catch (err) {
      console.error("모집 상태 변경 실패:", err.response || err);
      const errorMessage = err.response?.data?.message || "모집 상태 변경 중 오류가 발생했습니다.";
      setError(errorMessage);
    }
  };

  const handleViewPostDetail = (post) => { setSelectedPost(post); setShowForm(false); setEditingPost(null); };
  const handleBackToList = () => { setSelectedPost(null); };

  if (isLoading && postList.length === 0 && !selectedPost) {
    return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}> <CircularProgress /> <Typography sx={{ ml: 2 }} color="text.secondary">게시글 목록을 불러오는 중...</Typography> </Box> );
  }

  if (selectedPost) {
    return ( <MealMatePostDetailView post={selectedPost} onBackToList={handleBackToList} currentUserId={currentUserId} currentUserAvatarUrl={currentUserAvatarUrl} currentUserNickname={currentUserNickname} onSetStatusCompleted={handleSetStatusToCompleted} onEditPost={handleEditPost} /> );
  }

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'medium', mb: 2 }}>
        밥친구 구하기 게시판
      </Typography>
      <Button variant="contained" onClick={() => { setShowForm(true); setEditingPost(null); }} sx={{ mb: 2, minWidth: '200px' }}>
        새 게시글 작성하기
      </Button>

      {showForm && (
        <MealMatePostForm
          onAddPost={handleSavePost}
          initialFormData={editingPost}
          isEditMode={!!editingPost}
        />
      )}
      
      <Divider sx={{ width: '100%', maxWidth: '800px', my: 2 }} />

      {isLoading && postList.length > 0 && !selectedPost && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 1, gap: 1 }}>
          <CircularProgress size={20} /> <Typography variant="caption" color="text.secondary">업데이트 중...</Typography>
        </Box>
      )}
      {error && ( <Alert severity="error" sx={{ width: '100%', maxWidth: '800px', mb: 2 }} onClose={() => setError(null)}> {error} </Alert> )}
      
      {!isLoading && postList.length === 0 && !error && (
          <Paper sx={{p:3, textAlign:'center', width:'100%', maxWidth:'800px', mt:2}}>
            <Typography color="text.secondary">표시할 게시글이 없습니다. 새 글을 작성해보세요!</Typography>
          </Paper>
      )}
      {postList.length > 0 && !error && ( // 목록 표시는 에러가 없을 때만
        <MealMatePostList
            postList={postList}
            onDeletePost={handleDeletePost}
            onPostClick={handleViewPostDetail}
            currentUserId={currentUserId}
            onSetStatusCompleted={handleSetStatusToCompleted}
            onEditPost={handleEditPost}
        />
      )}
    </Box>
  );
};

export default MealMateBoardPage;