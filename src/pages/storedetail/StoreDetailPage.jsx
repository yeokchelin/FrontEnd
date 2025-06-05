// src/components/storedetail/StoreDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react"; // useCallback 추가
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Container,
  IconButton, // IconButton 추가
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DescriptionIcon from '@mui/icons-material/Description';
// 찜 관련 아이콘 추가
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // 찜 안 한 상태 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite'; // 찜 한 상태 아이콘
import axios from 'axios'; // axios를 사용하도록 변경 (fetch 대신 더 편리)

import { getCategoryDisplayInfo } from "../../constants/categoryConstants"; // ❗️ 실제 경로로 수정해주세요!

// ❗️ 부모로부터 onViewReviews, currentUserId prop을 새로 받습니다.
// currentUserId는 실제 로그인 시스템에서 받아와야 합니다.
export default function StoreDetailPage({ restaurantId, onBack, onViewReviews, currentUserId }) {
  const [storeDetail, setStoreDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // 찜 상태 추가
  const [favoriteLoading, setFavoriteLoading] = useState(false); // 찜 요청 로딩 상태
  const [favoriteCount, setFavoriteCount] = useState(0); // 찜한 사람 수 상태 추가

  // API_BASE_URL 설정
  const API_BASE_URL = 'http://localhost:8080/api'; // 백엔드 주소

  // 찜 카운트를 불러오는 함수
  const fetchFavoriteCount = useCallback(async () => {
    try {
      // GET /api/restaurants/{restaurantId}/favorites/count
      const response = await axios.get(`${API_BASE_URL}/restaurants/${restaurantId}/favorites/count`);
      setFavoriteCount(response.data.count); // 백엔드 응답 형식에 따라 조정 (예: { count: 5 })
    } catch (err) {
      console.error(`[StoreDetailPage] 찜 카운트 로딩 실패 (Restaurant ID: ${restaurantId}):`, err.response?.data || err.message || err);
      // 오류 발생 시 찜 카운트를 0으로 설정하거나 다른 처리를 할 수 있습니다.
      setFavoriteCount(0);
    }
  }, [restaurantId]);


  // 음식점 상세 정보를 불러오는 함수
  const fetchStoreDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // GET /api/restaurants/{restaurantId}
      const response = await axios.get(`${API_BASE_URL}/restaurants/${restaurantId}`);
      const data = response.data;
      
      setStoreDetail({
        ...data,
        reviewCount: data.reviews ? data.reviews.length : (data.reviewCount !== undefined ? data.reviewCount : 0),
        description: data.description || "상세 설명이 준비되지 않았습니다.",
        imageUrl: data.imageUrl,
      });

      // ❗️ 로그인된 사용자라면 찜 상태도 함께 확인
      // currentUserId가 백엔드의 KakaoUser.id (Long 타입)이어야 합니다.
      const numericCurrentUserId = currentUserId ? Number(currentUserId) : null;
      if (currentUserId && !isNaN(numericCurrentUserId)) {
        // GET /api/users/{userId}/favorites/restaurants/{restaurantId}
        try {
          const favoriteCheckResponse = await axios.get(`${API_BASE_URL}/users/${numericCurrentUserId}/favorites/restaurants/${restaurantId}`);
          setIsFavorite(favoriteCheckResponse.data.isFavorite); // 백엔드 응답 형식에 따라 조정 (예: { isFavorite: true/false })
        } catch (favErr) {
          console.warn(`찜 상태 확인 실패 (User ID: ${currentUserId}, Restaurant ID: ${restaurantId}):`, favErr.response?.data || favErr.message || favErr);
          setIsFavorite(false); // 확인 실패 시 기본값은 찜 안 된 상태
        }
      } else {
        setIsFavorite(false); // 로그인되지 않았거나 유효한 ID가 아니면 찜 안 된 상태로 설정
      }

      // 식당 상세 정보 로딩 후 찜 카운트 로딩
      fetchFavoriteCount(); // 찜 카운트 호출 추가

    } catch (err) {
      console.error(`[StoreDetailPage] ID '${restaurantId}' 음식점 상세 정보 로딩 실패:`, err.response?.data || err.message || err);
      setError(`음식점 정보를 불러오는 중 오류가 발생했습니다. 😔 (${err.response?.data?.message || err.message})`);
      setStoreDetail(null);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, currentUserId, fetchFavoriteCount]); // currentUserId, fetchFavoriteCount를 의존성 배열에 추가

  useEffect(() => {
    if (!restaurantId) {
      setError("잘못된 접근입니다. (ID 누락) 😥");
      setLoading(false);
      setStoreDetail(null);
      return;
    }
    fetchStoreDetail();
  }, [restaurantId, fetchStoreDetail]); // fetchStoreDetail이 useCallback으로 감싸져 있으므로 안전합니다.

  // 찜 버튼 클릭 핸들러
  const handleFavoriteToggle = async () => {
    const numericCurrentUserId = currentUserId ? Number(currentUserId) : null;

    if (!currentUserId || isNaN(numericCurrentUserId)) {
      alert("로그인이 필요한 기능입니다. (유효한 사용자 ID 없음)");
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // 찜 해제 API 호출: DELETE /api/users/{userId}/favorites/restaurants/{restaurantId}
        await axios.delete(`${API_BASE_URL}/users/${numericCurrentUserId}/favorites/restaurants/${restaurantId}`);
        setIsFavorite(false);
        setFavoriteCount(prevCount => Math.max(0, prevCount - 1)); // 찜 카운트 감소
        alert("찜 목록에서 제거되었습니다.");
      } else {
        // 찜 추가 API 호출: POST /api/users/{userId}/favorites/restaurants/{restaurantId}
        await axios.post(`${API_BASE_URL}/users/${numericCurrentUserId}/favorites/restaurants/${restaurantId}`);
        setIsFavorite(true);
        setFavoriteCount(prevCount => prevCount + 1); // 찜 카운트 증가
        alert("찜 목록에 추가되었습니다!");
      }
    } catch (err) {
      console.error("찜 상태 변경 실패:", err.response?.data || err.message || err);
      const errorMessage = err.response?.data?.message || err.message;
      // 이미 찜한 경우 (HTTP 409 Conflict)와 같은 특정 오류 메시지는 다르게 처리 가능
      if (err.response?.status === 409) {
          alert("이미 찜한 식당입니다.");
      } else {
          alert(`찜 상태 변경 실패: ${errorMessage}`);
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  // ⭐️ 리뷰 보기 Chip 클릭 핸들러
  const handleReviewChipClick = () => {
    if (typeof onViewReviews === 'function') {
      onViewReviews(storeDetail); // 부모에게 현재 식당 객체 전달
    } else {
      console.error("[StoreDetailPage] onViewReviews prop이 함수가 아닙니다!");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>상세 정보를 불러오는 중... 🍜</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={onBack}>
            뒤로 가기
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!storeDetail) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">음식점 정보를 표시할 수 없습니다. 🙁</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mt: 2 }} variant="outlined">
          목록으로 돌아가기
        </Button>
      </Container>
    );
  }

  const {
    name = "이름 정보 없음",
    category = "정보 없음",
    description = "상세 설명이 준비되지 않았습니다.",
    rating,
    reviewCount,
    imageUrl,
  } = storeDetail;

  const categoryDisplay = getCategoryDisplayInfo(category);

  return (
    <Container maxWidth="md" sx={{ py: {xs: 2, sm: 3, md: 4} }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mr: 2 }} // 찜 버튼과의 간격 조정
            variant="outlined"
          >
            목록으로 돌아가기
          </Button>
          {/* 찜하기/찜 해제 버튼 (텍스트 포함) */}
          <Button
            variant="contained" // 버튼 스타일 변경 (contained, outlined, text 중 선택)
            color={isFavorite ? "error" : "primary"} // 찜 되어 있으면 빨간색, 아니면 기본색
            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading} // 찜 요청 중에는 버튼 비활성화
            sx={{ minWidth: '120px' }} // 버튼 최소 너비 설정
          >
            {favoriteLoading ? <CircularProgress size={20} color="inherit" /> : (isFavorite ? "찜 해제" : "찜하기")}
          </Button>
        </Box>

        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={name}
            sx={{
              width: '100%',
              maxHeight: { xs: '250px', sm: '350px', md: '400px' },
              objectFit: 'cover',
              borderRadius: 2,
              mb: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
        ) : (
          <Box sx={{ height: { xs: '200px', sm: '300px' }, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mb: 3, color: 'grey.500' }}>
            <Typography>이미지 없음</Typography>
          </Box>
        )}

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', wordBreak: 'keep-all' }}>
          {name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={categoryDisplay.icon}
            label={categoryDisplay.label}
            variant="filled"
            size="medium"
            sx={{ fontWeight: 'medium' }}
          />
          {typeof rating === 'number' && rating > 0 && (
            <Chip
              icon={<StarIcon sx={{ color: '#FFB400 !important' }} />}
              label={`${rating.toFixed(1)}`}
              color="default"
              size="medium"
              sx={{ fontWeight: 'medium', '.MuiChip-label': { pl:0.5 } }}
            />
          )}
          {/* 리뷰 수 Chip 수정: onClick 핸들러 추가 */}
          {typeof reviewCount === 'number' && reviewCount > 0 && (
            <Chip
              icon={<RateReviewIcon />}
              label={`리뷰 ${reviewCount}개`}
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 'medium', cursor: 'pointer' }} // ⭐️ 클릭 가능하도록 cursor 추가
              onClick={handleReviewChipClick} // ⭐️ onClick 핸들러 연결
            />
          )}
          {/* 찜한 사람 수 Chip 추가 */}
          {favoriteCount > 0 && (
            <Chip
              icon={<FavoriteIcon sx={{ color: 'error.main !important' }} />} // 찜 아이콘
              label={`찜 ${favoriteCount}명`}
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 'medium' }}
            />
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <DescriptionIcon /> 상세 설명
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-line' }}>
            {description}
          </Typography>
        </Box>

        {/* 댓글(CommentSection) 컴포넌트 추가 위치 (주석 처리) */}
        {/* <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>댓글</Typography>
        <CommentSection targetId={restaurantId} ... (필요한 props 전달) ... /> */}

      </Paper>
    </Container>
  );
}