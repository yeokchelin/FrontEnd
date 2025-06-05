// src/pages/board/MealMateBoardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Divider, CircularProgress, Alert, Button,
  Paper, IconButton, Chip, Modal // Modal 임포트 추가 (상세 보기 모달용)
} from '@mui/material';
import MealMatePostList from '../../components/mealmateboard/MealMatePostList';
import MealMatePostForm from '../../components/mealmateboard/MealMatePostForm';
import CommentSection from '../../components/comments/CommentSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import WcIcon from '@mui/icons-material/Wc';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close'; // 모달 닫기 아이콘
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const API_BASE_URL = '/api';

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

// 밥친구 게시판 상세 보기 컴포넌트를 Modal 내부에 직접 렌더링할 것이므로,
// MealMatePostDetailView는 FreeBoardPage에서처럼 별도의 컴포넌트로 분리하지 않고
// MealMateBoardPage 내부에 필요한 UI 로직을 배치하거나, props로 데이터를 받도록 변경
// (여기서는 기존 MealMatePostDetailView 코드를 Modal 내부에 맞게 조정하여 유지)
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
    // 백엔드 MatePostDto에 맞춰 필드명 사용
    const { id, title = "제목 없음", writer = "익명", content = "내용 없음",
            meetingStation = "미정", meetingTime = "미정", recruitCount,
            preferredGender, status = "정보 없음", createdAt, kakaoUserId: postAuthorKakaoUserId } = post; // postAuthorKakaoUserId 추가

    const isRecruiting = status === '모집 중';
    // isAuthor는 이제 currentUserId(로그인한 사용자 ID)와 게시글 작성자 ID(post.kakaoUserId)를 비교
    const isAuthor = currentUserId !== null && postAuthorKakaoUserId !== null && currentUserId === postAuthorKakaoUserId;

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
          <Typography variant="subtitle2" color="text.secondary">작성자: {writer}</Typography> {/* writer (닉네임) 필드 사용 */}
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
          targetType="MEAL_BOARD_POST" // 밥친구 게시판 타입 명시 (백엔드 Comment 대상 타입과 일치)
          currentUserId={currentUserId}
          currentUserAvatarUrl={currentUserAvatarUrl}
          currentUserNickname={currentUserNickname}
          isCommentingDisabled={!isRecruiting}
        />
      </Paper>
    );
};


// MealMateBoardPage 컴포넌트의 props에 currentUserId, currentUserNickname, currentUserAvatarUrl 추가
const MealMateBoardPage = ({ currentUserId, currentUserNickname, currentUserAvatarUrl }) => { // props 추가
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 폼 제출 로딩 상태를 위한 변수명 변경 (컨트롤러 로딩과 구분)
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // 게시글 작성/수정 폼 표시 여부
  const [editingPost, setEditingPost] = useState(null); // 수정할 게시글 데이터
  const [selectedPost, setSelectedPost] = useState(null); // 상세 보기할 게시글 데이터

  // ★★★ MealMatePostDetailView를 모달로 사용하기 위한 상태 ★★★
  const [openDetailModal, setOpenDetailModal] = useState(false);


  // 게시글 목록을 불러오는 함수
  const fetchPosts = useCallback(async () => {
    setIsLoading(true); // 목록 로딩 시작
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
      setIsLoading(false); // 목록 로딩 종료
    }
  }, []);

  // 컴포넌트 마운트 시 또는 selectedPost가 변경될 때 (상세보기 닫힐 때) 게시글 불러오기
  useEffect(() => {
    if (!selectedPost) { // 상세보기가 닫혔을 때만 목록을 다시 가져옴
      fetchPosts();
    }
  }, [selectedPost, fetchPosts]);


  // 게시글 저장 (작성 또는 수정)
  const handleSavePost = async (formDataFromChild) => {
    const isEditMode = !!editingPost;
    const method = isEditMode ? 'put' : 'post';
    const url = isEditMode
      ? `${API_BASE_URL}/boardmatefood/posts/${formDataFromChild.id}?currentKakaoUserId=${currentUserId}` // 수정 시 사용자 ID 포함
      : `${API_BASE_URL}/boardmatefood/write`;

    setError(null);
    setIsLoading(true); // 폼 제출 로딩 시작

    try {
      // 백엔드 MatePostDto에 정확히 매핑되도록 필드명 일치
      const postPayload = {
        id: formDataFromChild.id, // 수정 시에만 존재
        title: formDataFromChild.title, // MealMatePostForm에서 postTitle -> title로 변경해야 함
        content: formDataFromChild.content, // MealMatePostForm에서 postContent -> content로 변경해야 함
        meetingStation: formDataFromChild.meetingStation,
        meetingTime: formDataFromChild.meetingTime,
        recruitCount: formDataFromChild.recruitCount, // MealMatePostForm에서 partySize -> recruitCount로 변경해야 함
        preferredGender: formDataFromChild.preferredGender,
        status: formDataFromChild.status,
        kakaoUserId: formDataFromChild.kakaoUserId, // ★★★ 포함 ★★★
        writer: formDataFromChild.writer, // ★★★ 포함 ★★★
        // writerAvatarUrl은 DTO에 있지만 현재 폼에서는 직접 받지 않으므로 전송 안함 (백엔드에서 DTO 변환 시 KakaoUser로부터 가져옴)
      };

      const response = await axios[method](url, postPayload);
      
      alert(`게시글이 성공적으로 ${isEditMode ? '수정' : '등록'}되었습니다!`);
      setShowForm(false);
      setEditingPost(null);
      fetchPosts(); // 목록 갱신
    } catch (err) {
      console.error(`게시글 ${isEditMode ? '수정' : '등록'} 실패:`, err.response || err);
      const errorMessage = err.response?.data?.message || err.message || `게시글 ${isEditMode ? '수정' : '등록'} 중 오류 발생`;
      setError(errorMessage);
    } finally {
      setIsLoading(false); // 폼 제출 로딩 종료
    }
  };
  
  // 게시글 수정 버튼 클릭 (목록 또는 상세 보기에서)
  const handleEditPost = (postToEdit) => {
    // 권한 확인: 현재 로그인된 사용자와 게시글 작성자(kakaoUserId)가 같은지
    if (currentUserId === null || postToEdit.kakaoUserId === null || currentUserId !== postToEdit.kakaoUserId) {
        alert("이 게시글을 수정할 권한이 없습니다.");
        return;
    }

    if (postToEdit.status !== '모집 중') {
        alert('모집이 완료된 게시글은 수정할 수 없습니다.');
        return;
    }
    // 상세 보기 모달이 열려 있다면 닫기
    if (selectedPost) {
        setOpenDetailModal(false);
        setSelectedPost(null);
    }
    setEditingPost(postToEdit); // 수정할 게시글 데이터 설정
    setShowForm(true); // 폼 표시
  };

  // 게시글 삭제
  const handleDeletePost = async (postIdToDelete) => { // postId -> postIdToDelete로 파라미터명 변경
    // 권한 확인: 현재 로그인된 사용자와 게시글 작성자(kakaoUserId)가 같은지 (선택적으로 백엔드에서도 검증)
    const postToDelete = postList.find(p => p.id === postIdToDelete) || selectedPost; // 목록에서 찾거나 상세보기 중인 게시글
    if (currentUserId === null || postToDelete.kakaoUserId === null || currentUserId !== postToDelete.kakaoUserId) {
        alert("이 게시글을 삭제할 권한이 없습니다.");
        return;
    }

    if (selectedPost && selectedPost.id === postIdToDelete) {
      alert("상세 보기 중인 게시글은 목록에서 직접 삭제할 수 없습니다. 모달 내에서 삭제 버튼을 누르거나, 목록으로 돌아가서 시도해주세요.");
      return;
    }
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
        setError(null);
        setIsLoading(true); // 로딩 시작
        try {
            // ★★★ currentKakaoUserId를 쿼리 파라미터로 전달 ★★★
            await axios.delete(`${API_BASE_URL}/boardmatefood/posts/${postIdToDelete}?currentKakaoUserId=${currentUserId}`);
            fetchPosts(); // 목록 갱신
            alert("게시글이 삭제되었습니다.");
        } catch (err) {
            console.error("게시글 삭제 실패:", err.response || err);
            const errorMessage = err.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다.";
            setError(errorMessage);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    }
  };

  // 게시글 상태를 '모집 완료'로 변경
  const handleSetStatusToCompleted = async (postIdToUpdate) => { // postId -> postIdToUpdate로 파라미터명 변경
    // 권한 확인: 현재 로그인된 사용자와 게시글 작성자(kakaoUserId)가 같은지
    const postToUpdate = postList.find(p => p.id === postIdToUpdate) || selectedPost; // 목록에서 찾거나 상세보기 중인 게시글
    if (currentUserId === null || postToUpdate.kakaoUserId === null || currentUserId !== postToUpdate.kakaoUserId) {
        alert("이 게시글의 상태를 변경할 권한이 없습니다.");
        return;
    }

    setError(null);
    setIsLoading(true); // 로딩 시작
    try {
      const payload = { status: "모집 완료" };
      // ★★★ currentKakaoUserId를 쿼리 파라미터로 전달 ★★★
      const response = await axios.patch(`${API_BASE_URL}/boardmatefood/posts/${postIdToUpdate}/status?currentKakaoUserId=${currentUserId}`, payload);
      
      setPostList(prevList => prevList.map(p =>
        p.id === postIdToUpdate ? response.data : p
      ));
      if (selectedPost && selectedPost.id === postIdToUpdate) {
        setSelectedPost(response.data); // 상세 보기 중인 게시글의 상태도 업데이트
      }
      alert("모집 상태가 '모집 완료'로 변경되었습니다.");
    } catch (err) {
      console.error("모집 상태 변경 실패:", err.response || err);
      const errorMessage = err.response?.data?.message || "모집 상태 변경 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 상세 보기 모달 열기
  const handleOpenDetailModal = (post) => {
    setSelectedPost(post);
    setOpenDetailModal(true); // 모달 열기
    setShowForm(false); // 폼 닫기
    setEditingPost(null); // 수정 모드 해제
  };

  // 상세 보기 모달 닫기
  const handleCloseDetailModal = () => {
    setSelectedPost(null); // 선택된 게시글 초기화
    setOpenDetailModal(false); // 모달 닫기
    fetchPosts(); // 목록 새로고침 (상세 보기에서 변경이 있었을 수 있으므로)
  };


  // 로딩 UI (게시글 목록 초기 로딩 시)
  if (isLoading && postList.length === 0 && !selectedPost && !showForm) {
    return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}> <CircularProgress /> <Typography sx={{ ml: 2 }} color="text.secondary">게시글 목록을 불러오는 중...</Typography> </Box> );
  }

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2.5, sm: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'medium', mb: 2 }}>
        밥친구 구하기 게시판
      </Typography>

      {/* 새 게시글 작성 버튼 */}
      {!showForm && !selectedPost && ( // 폼이 열려있지 않고 상세보기가 아닐 때만 버튼 표시
        <Button variant="contained" onClick={() => { setShowForm(true); setEditingPost(null); }} sx={{ mb: 2, minWidth: '200px' }}>
          새 게시글 작성하기
        </Button>
      )}

      {/* 게시글 작성/수정 폼 */}
      {showForm && (
        <MealMatePostForm
          onAddPost={handleSavePost}
          initialFormData={editingPost}
          isEditMode={!!editingPost}
          currentUserId={currentUserId} // ★★★ currentUserId 전달 ★★★
          currentUserNickname={currentUserNickname} // ★★★ currentUserNickname 전달 ★★★
          isLoading={isLoading} // ★★★ 폼 제출 로딩 상태 전달 ★★★
        />
      )}
      {showForm && ( // 폼이 열려있을 때만 "폼 닫기" 버튼 표시
        <Button onClick={() => { setShowForm(false); setEditingPost(null); setError(null); }} sx={{ mb: 2 }}>
          {editingPost ? "수정 취소" : "폼 닫기"}
        </Button>
      )}

      <Divider sx={{ width: '100%', maxWidth: '800px', my: 2 }} />

      {/* 로딩 인디케이터 (목록 업데이트 중) */}
      {isLoading && postList.length > 0 && !selectedPost && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 1, gap: 1 }}>
          <CircularProgress size={20} /> <Typography variant="caption" color="text.secondary">업데이트 중...</Typography>
        </Box>
      )}
      {/* 에러 메시지 */}
      {error && ( <Alert severity="error" sx={{ width: '100%', maxWidth: '800px', mb: 2 }} onClose={() => setError(null)}> {error} </Alert> )}
      
      {/* 게시글 목록이 비어있을 때 메시지 */}
      {!isLoading && !showForm && postList.length === 0 && !error && (
          <Paper sx={{p:3, textAlign:'center', width:'100%', maxWidth:'800px', mt:2}}>
            <Typography color="text.secondary">표시할 게시글이 없습니다. 새 글을 작성해보세요!</Typography>
          </Paper>
      )}
      {/* 게시글 목록 */}
      {!showForm && postList.length > 0 && !error && (
        <MealMatePostList
            postList={postList}
            onDeletePost={handleDeletePost}
            onPostClick={handleOpenDetailModal} // 상세 보기 모달을 열도록 변경
            currentUserId={currentUserId} // 권한 확인을 위해 전달
            onSetStatusCompleted={handleSetStatusToCompleted} // 모집 완료 기능 전달
            onEditPost={handleEditPost} // 수정 기능 전달
        />
      )}

      {/* 상세 보기 모달 렌더링 */}
      <Modal
        open={openDetailModal} // 새로운 모달 상태
        onClose={handleCloseDetailModal} // 모달 닫기 핸들러
        aria-labelledby="meal-post-detail-modal-title"
        aria-describedby="meal-post-detail-modal-description"
        sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} // 모달 중앙 정렬
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '800px' }, // 모달 너비 조정
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          outline: 'none',
        }}>
          {selectedPost ? (
            <>
              {/* 모달 헤더 - 닫기 버튼 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography id="meal-post-detail-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                  {selectedPost.title} {/* 게시글 제목 */}
                </Typography>
                <IconButton onClick={handleCloseDetailModal} aria-label="닫기">
                  <CloseIcon />
                </IconButton>
              </Box>
              <MealMatePostDetailView
                post={selectedPost}
                onBackToList={handleCloseDetailModal} // 모달 닫기 버튼으로 사용
                currentUserId={currentUserId}
                currentUserAvatarUrl={currentUserAvatarUrl}
                currentUserNickname={currentUserNickname}
                onSetStatusCompleted={handleSetStatusToCompleted}
                onEditPost={handleEditPost}
              />
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <Typography>게시글 정보를 불러오는 중...</Typography>
              <CircularProgress size={20} sx={{ mt: 1 }} />
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MealMateBoardPage;