// src/pages/board/FreeBoardPage.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import { Box, Typography, Divider, Button, Paper, IconButton, CircularProgress } from '@mui/material'; // Button, IconButton 등 추가
import FreePostList from '../../components/freeboard/FreePostList';
import FreePostForm from '../../components/freeboard/FreePostForm';
import CommentSection from '../../components/comments/CommentSection'; // ❗️ CommentSection 임포트
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // '뒤로 가기' 아이콘

// ❗️ FreePostItem 컴포넌트도 이 페이지에서 props를 통해 클릭 핸들러를 받을 수 있도록 수정이 필요합니다.
//    또는 FreePostList에서 handleViewPostDetail을 각 아이템에 연결해줘야 합니다.
//    여기서는 FreePostList가 onPostClick과 같은 prop을 받아 FreePostItem에 전달한다고 가정합니다.

// 더미 데이터 (createdAt을 Date 객체로 변경 또는 new Date()로 감싸서 사용 권장)
const DUMMY_FREE_POST_DATA = [
  { id: 'free1', authorName: '자유인', title: '안녕하세요! 자유 게시판입니다.', content: '자유롭게 글을 남겨주세요! \n\n여러 줄 테스트입니다.\n잘 부탁드립니다.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: 'free2', authorName: '질문러', title: 'React 질문있어요!', content: '훅 사용법이 궁금합니다. \n\n특히 useEffect와 useCallback의 차이점이 헷갈리네요.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'free3', authorName: '새로운 소식', title: '개발 근황 공유합니다.', content: '요즘 새로운 기술 스택(MUI, Zustand)을 배우고 있습니다. \n\n생각보다 재미있네요!', createdAt: new Date().toISOString() },
].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순 정렬


// ❗️ 개별 글 상세 보기 및 댓글을 위한 컴포넌트 (FreeBoardPage 내부에 정의 또는 분리)
const FreePostDetailView = ({ post, onBackToList, currentUserId, currentUserAvatarUrl }) => {
  if (!post) return null;

  // 날짜 포맷 함수 (CommentItem에서 가져오거나 공통 유틸로 분리)
  const formatDate = (isoString) => {
    if (!isoString) return '날짜 정보 없음';
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
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
          작성자: {post.authorName}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          작성일: {formatDate(post.createdAt)}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.7, mb: 4 }}>
        {post.content}
      </Typography>

      {/* 댓글 섹션 통합 */}
      <CommentSection
        targetId={post.id.toString()} // 현재 게시글의 ID를 targetId로 전달
        currentUserId={currentUserId}
        currentUserAvatarUrl={currentUserAvatarUrl}
      />
    </Paper>
  );
};


const FreeBoardPage = () => {
  const [freePostList, setFreePostList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // ❗️ 선택된 게시글 상태
  const [isLoading, setIsLoading] = useState(true); // ❗️ 로딩 상태 추가

  // ❗️ 임시: 현재 로그인한 사용자 정보 (실제로는 Context 등에서 가져와야 함)
  const currentUserId = "testUser123"; // 댓글 작성/수정/삭제 시 사용
  const currentUserAvatarUrl = "https://via.placeholder.com/40/FFA500/FFFFFF?Text=Me";

  // 더미 데이터 로딩 시뮬레이션 (실제로는 API 호출)
  useEffect(() => {
    setIsLoading(true);
    // API 호출 시뮬레이션
    setTimeout(() => {
      setFreePostList(DUMMY_FREE_POST_DATA);
      setIsLoading(false);
    }, 500);
  }, []);


  // 새 게시글 추가 핸들러
  const handleAddFreePost = (newPostItem) => {
    // 실제 API 연동 시:
    // axios.post('/api/freeboard', newPostItem).then(response => {
    //   setFreePostList(prevPosts => [response.data, ...prevPosts]);
    // }).catch(error => console.error("Error adding post:", error));
    const postWithId = { ...newPostItem, id: `free${Date.now()}` }; // 임시 ID 부여
    setFreePostList(prevPosts => [postWithId, ...prevPosts].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    alert("새 글이 등록되었습니다! (현재는 더미 데이터)");
  };

  // ❗️ 게시글 상세 보기 핸들러
  const handleViewPostDetail = (post) => {
    setSelectedPost(post);
  };

  // ❗️ 목록으로 돌아가기 핸들러
  const handleBackToList = () => {
    setSelectedPost(null);
  };

  // 로딩 중 UI
  if (isLoading && !selectedPost) { // 목록 로딩 중일 때만 (상세보기 아닐 때)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>게시글 목록을 불러오는 중...</Typography>
      </Box>
    );
  }

  // 상세 보기 상태일 때 렌더링
  if (selectedPost) {
    return (
      <FreePostDetailView
        post={selectedPost}
        onBackToList={handleBackToList}
        currentUserId={currentUserId}
        currentUserAvatarUrl={currentUserAvatarUrl}
      />
    );
  }

  // 목록 보기 상태일 때 렌더링 (기존 UI)
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

      <FreePostForm onAddPost={handleAddFreePost} />

      <Divider
        sx={{
          width: '100%',
          maxWidth: {
            xs: `calc(100% - ${(theme) => theme.spacing(4)})`,
            sm: '700px',
          },
          my: 2,
        }}
      />
      {/* ❗️ FreePostList에 onPostClick prop 전달 */}
      <FreePostList postList={freePostList} onPostClick={handleViewPostDetail} />
    </Box>
  );
};

export default FreeBoardPage;