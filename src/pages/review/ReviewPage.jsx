// src/pages/ReviewPage.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import { Box, Typography, Divider, Rating, Paper, CircularProgress, Alert } from '@mui/material';
import ReviewList from '../../components/reviews/ReviewList';
import ReviewForm from '../../components/reviews/ReviewForm';
import axios from 'axios'; // axios 임포트

const API_BASE_URL = '/api'; // Vite 프록시를 통해 /api 접두사 사용

const ReviewPage = () => {
  const [reviewList, setReviewList] = useState([]); // 초기값 빈 배열
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 예시: 새 리뷰 작성 시 사용할 고정된 storeId (실제 앱에서는 동적으로 결정되어야 함)
  const DUMMY_STORE_ID_FOR_NEW_REVIEWS = 1; // Long 타입이므로 숫자 1 또는 문자열 "1"

  // 리뷰 목록 불러오기 함수
  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 모든 리뷰를 가져오거나, 특정 storeId에 대한 리뷰만 가져오도록 API 수정 가능
      // 여기서는 모든 리뷰를 가져온다고 가정: GET /api/reviews
      const response = await axios.get(`${API_BASE_URL}/reviews`);
      // 백엔드에서 createdAt 기준으로 정렬해서 줄 수도 있고, 프론트에서 할 수도 있음
      const sortedReviews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviewList(sortedReviews);
    } catch (err) {
      console.error("리뷰 목록 로딩 실패:", err);
      setError("리뷰 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 리뷰 목록 불러오기
  useEffect(() => {
    fetchReviews();
  }, []);

  // 새 리뷰 추가 핸들러
  const handleAddReview = async (formDataFromChild) => {
    // ReviewForm에서 전달된 데이터에 storeId 추가
    const newReviewPayload = {
      ...formDataFromChild,
      storeId: DUMMY_STORE_ID_FOR_NEW_REVIEWS, // ❗️ 임시 storeId 사용
      // authorName은 formDataFromChild에 이미 포함되어 있음
      // ratingValue, commentText, title, imageUrl도 formDataFromChild에 포함
    };

    setIsLoading(true); // 요청 시작 시 로딩 상태 true
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/reviews`, newReviewPayload);
      fetchReviews(); // 성공 시 리뷰 목록 새로고침
      alert('리뷰가 성공적으로 등록되었습니다!');
    } catch (err) {
      console.error("리뷰 등록 실패:", err.response || err);
      const errorMessage = err.response?.data?.message || err.message || "리뷰 등록 중 오류가 발생했습니다.";
      setError(errorMessage);
      alert(`리뷰 등록 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false); // 요청 완료 시 로딩 상태 false
    }
  };

  // 평균 별점 계산
  const averageRating = reviewList.length > 0
    ? parseFloat((reviewList.reduce((sum, item) => sum + item.ratingValue, 0) / reviewList.length).toFixed(1))
    : 0;

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 4 },
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'medium' }}
      >
        사용자 리뷰
      </Typography>

      {/* 평균 별점 표시 영역 */}
      {reviewList.length > 0 && ( // 리뷰가 있을 때만 평균 별점 표시
        <Paper
          elevation={1}
          sx={{
            p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 1.5, bgcolor: 'action.hover', borderRadius: 1.5,
            width: 'fit-content', mx: 'auto',
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>평균 별점:</Typography>
          <Rating name="average-rating-display" value={averageRating} precision={0.1} readOnly size="medium" sx={{ color: 'warning.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{averageRating}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>/ 5</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>({reviewList.length}개 리뷰)</Typography>
        </Paper>
      )}

      {/* 리뷰 작성 폼 */}
      {/* ❗️ ReviewForm에 storeId를 전달합니다. 실제 값으로 변경 필요. */}
      <ReviewForm onAddReview={handleAddReview} storeId={DUMMY_STORE_ID_FOR_NEW_REVIEWS} />

      <Divider sx={{ width: '100%', maxWidth: { xs: `calc(100% - 32px)`, sm: '800px' }, my: 2 }} />

      {/* 로딩 및 에러 UI */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, gap: 1 }}>
          <CircularProgress size={24} />
          <Typography>리뷰 목록 로딩 중...</Typography>
        </Box>
      )}
      {error && !isLoading && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: '800px', mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 리뷰 목록 (로딩 중이 아니고 에러도 없을 때) */}
      {!isLoading && !error && (
        <ReviewList reviewList={reviewList} />
      )}
    </Box>
  );
};

export default ReviewPage;