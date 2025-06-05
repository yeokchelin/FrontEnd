// src/components/store/StoreDetailPage.jsx
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DescriptionIcon from '@mui/icons-material/Description';

import { getCategoryDisplayInfo } from "../../constants/categoryConstants"; // ❗️ 실제 경로로 수정해주세요!

// ❗️ 부모로부터 onViewReviews prop을 새로 받습니다.
export default function StoreDetailPage({ restaurantId, onBack, onViewReviews }) {
  const [storeDetail, setStoreDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setError("잘못된 접근입니다. (ID 누락) 😥");
      setLoading(false);
      setStoreDetail(null);
      return;
    }

    const fetchStoreDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `정보를 불러오지 못했습니다 (${response.status})` }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStoreDetail({
          ...data,
          reviewCount: data.reviews ? data.reviews.length : (data.reviewCount !== undefined ? data.reviewCount : 0),
          description: data.description || "상세 설명이 준비되지 않았습니다.",
          imageUrl: data.imageUrl,
        });
      } catch (err) {
        console.error(`[StoreDetailPage] ID '${restaurantId}' 음식점 상세 정보 로딩 실패:`, err);
        setError(`음식점 정보를 불러오는 중 오류가 발생했습니다. 😔 (${err.message})`);
        setStoreDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetail();
  }, [restaurantId]);

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

  // ⭐️ 리뷰 보기 Chip 클릭 핸들러
  const handleReviewChipClick = () => {
    if (typeof onViewReviews === 'function') {
      onViewReviews(storeDetail); // 부모에게 현재 식당 객체 전달
    } else {
      console.error("[StoreDetailPage] onViewReviews prop이 함수가 아닙니다!");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: {xs: 2, sm: 3, md: 4} }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          목록으로 돌아가기
        </Button>

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