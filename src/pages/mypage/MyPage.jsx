// src/pages/Mypage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Button,
  Divider, ListItemIcon, Chip, CircularProgress, Alert, ListItemButton
} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article'; // '나의 작성글' 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
// 각 게시판 타입별 아이콘
import RateReviewIcon from '@mui/icons-material/RateReview';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ForumIcon from '@mui/icons-material/Forum';
import axios from 'axios'; // API 호출을 위해

// API 기본 URL (Vite 프록시 사용 가정)
const API_BASE_URL = '/api';

// SectionPaper 헬퍼 컴포넌트 (이전과 동일)
const SectionPaper = ({ title, icon, children }) => (
  <Paper
    elevation={2}
    sx={{ p: { xs: 2, sm: 3 }, width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon && React.cloneElement(icon, { sx: { mr: 1.5, color: 'primary.main', fontSize: '1.75rem' } })}
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

// --- 각 게시판별 "내 작성글" API 호출 함수 (실제 API로 대체 필요) ---
// 각 함수는 { id, title, contentPreview, boardName, type, createdAt, targetName, viewPath, viewParams } 형태의 객체 배열을 반환한다고 가정
const fetchMyReviewsAPI = async () => {
  // 예시: return (await axios.get(`${API_BASE_URL}/me/reviews`)).data;
  console.log("Fetching my reviews...");
  await new Promise(resolve => setTimeout(resolve, 300)); // API 호출 시뮬레이션
  return [
    { id: 'rev1', title: "정말 최고의 맛집이에요!", contentPreview: "분위기도 좋고, 음식 맛도 일품!", boardName: "리뷰 게시판", type: "리뷰", createdAt: "2025-05-28T12:30:00Z", targetName: "A 레스토랑", viewPath: "reviewDetail", viewParams: { reviewId: 'rev1' } },
    { id: 'rev2', title: "가성비 좋은 카페", contentPreview: "커피가 저렴하고 맛있어요.", boardName: "리뷰 게시판", type: "리뷰", createdAt: "2025-05-27T10:00:00Z", targetName: "B 카페", viewPath: "reviewDetail", viewParams: { reviewId: 'rev2' } },
  ];
};

const fetchMyMealMatePostsAPI = async () => {
  // 예시: return (await axios.get(`${API_BASE_URL}/me/mealmate-posts`)).data;
  console.log("Fetching my mealmate posts...");
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { id: 'meal1', title: "강남역에서 오늘 점심 같이 드실 분?", contentPreview: "파스타 먹고 싶어요! 12시쯤 같이 가실 분~", boardName: "밥친구 게시판", type: "밥친구", createdAt: "2025-05-29T09:00:00Z", targetName: "강남역", viewPath: "mealMateDetail", viewParams: { postId: 'meal1' } },
  ];
};

const fetchMyFreeBoardPostsAPI = async () => {
  // 예시: return (await axios.get(`${API_BASE_URL}/me/freeboard-posts`)).data;
  console.log("Fetching my freeboard posts...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 'free1', title: "MUI 테마 질문 드립니다.", contentPreview: "다크모드 적용 시 특정 컴포넌트 색상 변경이...", boardName: "자유 게시판", type: "자유", createdAt: "2025-05-28T18:00:00Z", targetName: "자유 주제", viewPath: "freeBoardDetail", viewParams: { postId: 'free1' } },
  ];
};

const fetchMyPollsAPI = async () => {
  // 예시: return (await axios.get(`${API_BASE_URL}/me/polls`)).data; // 내가 만든 투표 기준
  console.log("Fetching my polls...");
  await new Promise(resolve => setTimeout(resolve, 350));
  return [
    { id: 'poll1', title: "선호하는 계절은?", contentPreview: "봄, 여름, 가을, 겨울 중 가장 좋아하는 계절은?", boardName: "투표 게시판", type: "투표", createdAt: "2025-05-27T14:00:00Z", targetName: "계절 선호도 조사", viewPath: "pollDetail", viewParams: { pollId: 'poll1' } },
  ];
};
// --- API 호출 함수 끝 ---


export default function Mypage({ setView }) {
  const [myPosts, setMyPosts] = useState([]); // 모든 게시판의 내 작성글 통합 리스트
  const [favorites, setFavorites] = useState([]); // 찜한 가게 (기존 로직 유지 또는 API 연동)
  const [userLevel, setUserLevel] = useState("일반 회원");
  const [hasStores, setHasStores] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    // 사용자 등급 및 가게 보유 상태 로드 (기존 로직)
    let currentLevel = "일반 회원";
    let storesExist = false;
    try {
      const savedStoresData = localStorage.getItem('userRegisteredStores');
      if (savedStoresData) {
        const registeredStores = JSON.parse(savedStoresData);
        if (Array.isArray(registeredStores) && registeredStores.length > 0) {
          currentLevel = "점주 회원";
          storesExist = true;
        }
      }
    } catch (e) { console.error("Mypage: 로컬 스토리지 로딩 실패", e); }
    setUserLevel(currentLevel);
    setHasStores(storesExist);

    // "나의 작성글" 데이터 로드
    const loadAllMyPosts = async () => {
      setIsLoadingPosts(true);
      setPostsError(null);
      try {
        // 각 게시판별 "내 작성글" API 병렬 호출
        const results = await Promise.allSettled([
          fetchMyReviewsAPI(),
          fetchMyMealMatePostsAPI(),
          fetchMyFreeBoardPostsAPI(),
          fetchMyPollsAPI(),
        ]);

        let combinedPosts = [];
        results.forEach(result => {
          if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            combinedPosts = combinedPosts.concat(result.value);
          } else if (result.status === 'rejected') {
            console.error("Error fetching one of the post types:", result.reason);
            // 개별 API 호출 실패에 대한 처리도 가능 (예: 부분적으로만 로드)
          }
        });

        // 모든 게시글을 작성일(createdAt) 기준으로 최신순 정렬
        const sortedPosts = combinedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMyPosts(sortedPosts);

      } catch (error) { // Promise.allSettled 자체는 에러를 throw하지 않지만, 만약을 대비
        console.error("Error loading user posts:", error);
        setPostsError("작성글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoadingPosts(false);
      }
    };

    loadAllMyPosts();

    // 찜한 가게 더미 데이터 (필요시 API 연동)
    setFavorites([
      { id: 'fav1', name: "이태원 파스타 전문점" },
      { id: 'fav2', name: "한남동 디저트 맛집" },
    ]);

  }, []);

  const handleManageStore = () => {
    setView("manageStore");
  };

  const getPostTypeIcon = (type) => {
    const iconStyle = { verticalAlign: 'middle', mr: 0.5, fontSize: '1.1rem' };
    if (type === '리뷰') return <RateReviewIcon sx={iconStyle} />;
    if (type === '밥친구') return <RestaurantIcon sx={iconStyle} />;
    if (type === '투표') return <HowToVoteIcon sx={iconStyle} />;
    if (type === '자유') return <ForumIcon sx={iconStyle} />;
    return null;
  };

  // 게시글 항목 클릭 시 해당 게시글 상세 보기로 이동 (setView 활용)
  const handlePostItemClick = (post) => {
    // TODO: 각 post.type에 따라 적절한 view 문자열과 파라미터를 setView로 전달해야 합니다.
    // 아래는 예시이며, App.jsx의 view 라우팅 구조에 맞춰야 합니다.
    if (post.viewPath && post.viewParams) {
        console.log(`Navigating to ${post.viewPath} with params:`, post.viewParams);
        setView(post.viewPath, post.viewParams); // App.jsx의 setView가 두 번째 인자로 파라미터를 받을 수 있도록 수정 필요 가능성
    } else {
        alert(`'${post.title}' 게시글 상세보기 기능은 현재 설정되지 않았습니다.`);
    }
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 3, sm: 4 } }}>
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'bold' }}>
        마이페이지
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 'lg', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <SectionPaper title="나의 작성글" icon={<ArticleIcon />}>
            {isLoadingPosts ? (
              <Box sx={{display: 'flex', justifyContent:'center', alignItems:'center', p:3, gap:1}}>
                <CircularProgress size={20} />
                <Typography color="text.secondary">게시글 로딩 중...</Typography>
              </Box>
            ) : postsError ? (
              <Alert severity="error" onClose={() => setPostsError(null)}>{postsError}</Alert>
            ) : myPosts.length > 0 ? (
              <List disablePadding>
                {myPosts.map((post, index) => (
                  <React.Fragment key={`${post.type}-${post.id}`}> {/* type과 id 조합으로 고유키 보장 */}
                    <ListItemButton
                      sx={{ px: 0, py: 1.5, flexDirection: 'column', alignItems: 'flex-start' }}
                      onClick={() => handlePostItemClick(post)} // ❗️ 클릭 시 상세 보기로 이동
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', mb: 0.5 }}>
                        <Typography component="div" sx={{ fontWeight: 'medium', color: 'text.primary', display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getPostTypeIcon(post.type)}
                          <Box component="span" sx={{ ml: post.type ? 0.5 : 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.title || "제목 없음"}
                          </Box>
                        </Typography>
                        <Chip label={post.boardName || post.type} size="small" variant="outlined" sx={{ ml: 1, flexShrink: 0 }} />
                      </Box>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.contentPreview || "내용 미리보기 없음"}
                          </Typography>
                        }
                        secondary={`대상: ${post.targetName || 'N/A'} | 작성일: ${new Date(post.createdAt).toLocaleDateString('ko-KR')}`}
                        secondaryTypographyProps={{ variant: 'caption', color: 'text.disabled' }}
                        sx={{ mt: 0, width: '100%' }}
                      />
                    </ListItemButton>
                    {index < myPosts.length - 1 && <Divider component="li" sx={{ my: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', py:2}}>작성한 게시글이 없습니다.</Typography>
            )}
          </SectionPaper>
        </Box>

        <Box sx={{ flex: 1, width: '100%' }}>
          <SectionPaper title="찜한 가게" icon={<FavoriteIcon />}>
            {/* 찜한 가게 목록 로딩/표시 로직도 위와 유사하게 API 연동 가능 */}
            {favorites.length > 0 ? (
              <List disablePadding>
                {favorites.map((fav, index) => (
                  <React.Fragment key={fav.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText primary={fav.name} />
                    </ListItem>
                    {index < favorites.length - 1 && <Divider component="li" sx={{my: 1}}/>}
                  </React.Fragment>
                ))}
              </List>
            ) : ( <Typography variant="body2" color="text.secondary">찜한 가게가 없습니다.</Typography> )}
          </SectionPaper>
        </Box>
      </Box>

      {/* 회원 등급 및 가게 관리 버튼 섹션 (기존과 동일) */}
      <Box sx={{ width: '100%', maxWidth: 'lg', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: { xs: 2, sm: 3 }, mt: 1 }}>
        <Box sx={{ flex: {sm: 1} }}>
          <SectionPaper title="회원 등급" icon={<AdminPanelSettingsIcon />}>
            <Typography variant="h6" sx={{ color: userLevel === "점주 회원" ? 'primary.main' : 'text.secondary', fontWeight: 'bold' }}>
              {userLevel}
            </Typography>
          </SectionPaper>
        </Box>
        {hasStores && (
          <Button variant="contained" color="primary" size="large" onClick={handleManageStore} startIcon={<StorefrontIcon />} sx={{ py: 1.5, fontWeight: 'bold', width: { xs: '100%', sm: 'auto' } }}>
            내 가게 관리
          </Button>
        )}
      </Box>
    </Box>
  );
}