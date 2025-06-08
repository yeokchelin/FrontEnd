// src/components/storedetail/StoreDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react";
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
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DescriptionIcon from '@mui/icons-material/Description';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

import { getCategoryDisplayInfo } from "../../constants/categoryConstants";


export default function StoreDetailPage({ restaurantId, onBack, onViewReviews, currentUserId, currentUserNickname, currentUserAvatarUrl }) {
  const [storeDetail, setStoreDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchFavoriteCount = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants/${restaurantId}/favorites/count`);
      setFavoriteCount(response.data.count);
    } catch (err) {
      console.error(`[StoreDetailPage] 찜 카운트 로딩 실패 (Restaurant ID: ${restaurantId}):`, err.response?.data || err.message || err);
      setFavoriteCount(0);
    }
  }, [restaurantId]);


  const fetchStoreDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { // ★★★ try 블록 시작 (59라인) ★★★
      // GET /api/restaurants/{restaurantId}
      const response = await axios.get(`${API_BASE_URL}/restaurants/${restaurantId}`);
      const data = response.data;
      
      setStoreDetail({
        ...data,
        reviewCount: data.reviews ? data.reviews.length : (data.reviewCount !== undefined ? data.reviewCount : 0),
        description: data.description || "상세 설명이 준비되지 않았습니다.",
        imageUrl: data.imageUrl,
      });

      const numericCurrentUserId = currentUserId ? Number(currentUserId) : null;
      if (currentUserId && !isNaN(numericCurrentUserId)) {
        // GET /api/users/{userId}/favorites/restaurants/{restaurantId}
        try {
          const favoriteCheckResponse = await axios.get(`${API_BASE_URL}/users/${numericCurrentUserId}/favorites/restaurants/${restaurantId}`);
          setIsFavorite(favoriteCheckResponse.data.isFavorite);
        } catch (favErr) {
          console.warn(`찜 상태 확인 실패 (User ID: ${currentUserId}, Restaurant ID: ${restaurantId}):`, favErr.response?.data || favErr.message || favErr);
          setIsFavorite(false);
        }
      } else {
        setIsFavorite(false);
      }

      fetchFavoriteCount();

    } catch (err) { // ★★★ try 블록에 대한 catch 블록 (이전에는 병합 마커로 분리) ★★★
      console.error(`[StoreDetailPage] ID '${restaurantId}' 음식점 상세 정보 로딩 실패:`, err.response?.data || err.message || err);
      setError(`음식점 정보를 불러오는 중 오류가 발생했습니다. 😔 (${err.response?.data?.message || err.message})`);
      setStoreDetail(null);
    } finally { // ★★★ finally 블록 ★★★
      setLoading(false);
    }
  }, [restaurantId, currentUserId, fetchFavoriteCount]);

  useEffect(() => {
    if (!restaurantId) {
      setError("잘못된 접근입니다. (ID 누락) 😥");
      setLoading(false);
      setStoreDetail(null);
      return;
    }
    fetchStoreDetail();
  }, [restaurantId, fetchStoreDetail]);

  const handleFavoriteToggle = async () => {
    const numericCurrentUserId = currentUserId ? Number(currentUserId) : null;

    if (!currentUserId || isNaN(numericCurrentUserId)) {
      alert("로그인이 필요한 기능입니다. (유효한 사용자 ID 없음)");
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`${API_BASE_URL}/users/${numericCurrentUserId}/favorites/restaurants/${restaurantId}`);
        setIsFavorite(false);
        setFavoriteCount(prevCount => Math.max(0, prevCount - 1));
        alert("찜 목록에서 제거되었습니다.");
      } else {
        await axios.post(`${API_BASE_URL}/users/${numericCurrentUserId}/favorites/restaurants/${restaurantId}`);
        setIsFavorite(true);
        setFavoriteCount(prevCount => prevCount + 1);
        alert("찜 목록에 추가되었습니다!");
      }
    } catch (err) {
      console.error("찜 상태 변경 실패:", err.response?.data || err.message || err);
      const errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 409) {
          alert("이미 찜한 식당입니다.");
      } else {
          alert(`찜 상태 변경 실패: ${errorMessage}`);
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReviewChipClick = () => {
    if (typeof onViewReviews === 'function') {
      onViewReviews(storeDetail);
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
    <Container maxWidth="lg" sx={{ py: {xs: 2, sm: 3, md: 4} }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            목록으로 돌아가기
          </Button>
          {/* 'X' 닫기 버튼 */}
          <IconButton
            onClick={onBack}
            aria-label="닫기"
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {/* 찜하기/찜 해제 버튼 */}
          <Button
            variant="contained"
            color={isFavorite ? "error" : "primary"}
            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            sx={{ minWidth: '120px' }}
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

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
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
          <Chip
    icon={<RateReviewIcon />}
    label={
      typeof reviewCount === 'number'
        ? (reviewCount === 0 ? "첫 리뷰 남기기" : `리뷰 ${reviewCount}개`)
        : "리뷰"
    }
    variant="outlined"
    size="medium"
    sx={{ fontWeight: 'medium', cursor: 'pointer' }}
    onClick={handleReviewChipClick}
  />
          {favoriteCount > 0 && (
            <Chip
              icon={<FavoriteIcon sx={{ color: 'error.main !important' }} />}
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
      </Paper>
    </Container>
  );
}