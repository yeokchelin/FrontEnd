// src/pages/review/ReviewPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Divider, Rating, Paper, CircularProgress, Alert, Button } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // 뒤로가기 버튼용
import ReviewList from '../../components/reviews/ReviewList'; // ❗️ 경로 확인 (올바른지 재확인)
import ReviewForm from '../../components/reviews/ReviewForm';   // ❗️ 경로 확인 (올바른지 재확인)
import axios from 'axios';

const API_BASE_URL = '/api/review'; // 백엔드 ReviewController의 @RequestMapping("/api/review")에 맞춤

// ❗️ App.jsx로부터 restaurant 객체 (Restaurant 엔티티 구조)와 onBack 함수를 props로 받도록 수정
const ReviewPage = ({ restaurant, onBack }) => {
  const [reviewList, setReviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⭐ 수정: restaurant prop에서 Restaurant 엔티티의 PK는 'id'입니다.
  const restaurantId = restaurant ? restaurant.id : null; // restaurant.id로 접근
  const restaurantName = restaurant ? restaurant.name : "알 수 없는 식당"; // Restaurant 엔티티의 'name' 필드

  // 리뷰 목록 불러오기 함수 (특정 restaurantId에 대한 리뷰만 가져오도록 수정)
  const fetchReviews = useCallback(async () => {
    if (!restaurantId) { // ⭐ 변수명 변경: storeId -> restaurantId
      setError("리뷰를 불러올 식당 정보가 없습니다.");
      setReviewList([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // ⭐ 수정: 백엔드 ReviewController의 @GetMapping("/restaurant/{restaurantId}") 엔드포인트 호출
      const response = await axios.get(`${API_BASE_URL}/restaurant/${restaurantId}`);
      // 서버에서 받은 리뷰 데이터를 최신순으로 정렬 (createdAt 필드 사용)
      const sortedReviews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviewList(sortedReviews);
    } catch (err) {
      console.error(`[ReviewPage] restaurantId '${restaurantId}' 리뷰 목록 로딩 실패:`, err.response?.data || err); // ⭐ 변수명 변경
      setError("리뷰 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setReviewList([]);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]); // ⭐ 변수명 변경: storeId -> restaurantId

  // 컴포넌트 마운트 시 또는 restaurantId 변경 시 리뷰 목록 불러오기
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 새 리뷰 추가 핸들러
  const handleAddReview = async (formDataFromChild) => {
    if (!restaurantId) { // ⭐ 변수명 변경: storeId -> restaurantId
      alert("리뷰를 작성할 식당 정보가 올바르지 않습니다.");
      return;
    }
    const newReviewPayload = {
      ...formDataFromChild,
      restaurantId: restaurantId, // ⭐ 수정: Restaurant의 ID를 보냄 (storeId -> restaurantId)
    };

    try {
      await axios.post(API_BASE_URL, newReviewPayload); // POST /api/review
      alert('리뷰가 성공적으로 등록되었습니다!');
      fetchReviews(); // 리뷰 목록 새로고침
    } catch (err) {
      console.error("리뷰 등록 실패:", err.response?.data || err);
      const errorMessage = err.response?.data?.message || err.message || "리뷰 등록 중 오류가 발생했습니다.";
      alert(`리뷰 등록 실패: ${errorMessage}`);
    }
  };

  // 평균 별점 계산 (reviewList의 각 item에 rate 필드가 있다고 가정)
  const averageRating = reviewList.length > 0
    ? parseFloat((reviewList.reduce((sum, item) => sum + item.rate, 0) / reviewList.length).toFixed(1))
    : 0;

  // 식당 정보가 없을 경우 (App.jsx에서 selectedRestaurantForReview가 null일 때 이 컴포넌트가 렌더링되지 않도록 이미 처리됨)
  // 이 조건문은 사실상 불필요하지만, 안정성을 위해 남겨둘 수는 있습니다.
  if (!restaurant) {
    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="warning">리뷰를 표시할 식당 정보가 선택되지 않았습니다.</Alert>
            {typeof onBack === 'function' && (
                <Button onClick={onBack} sx={{mt: 2}} variant="outlined">
                    이전 페이지로 돌아가기
                </Button>
            )}
        </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        py: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
      }}
    >
      {typeof onBack === 'function' && (
        <Button onClick={onBack} startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start', mb:1 }}>
          식당 상세로 돌아가기
        </Button>
      )}

      <Typography
        variant="h4"
        component="h1"
        sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'bold' }}
      >
        {restaurantName} 리뷰 {/* ⭐ 변수명 변경: storeName -> restaurantName */}
      </Typography>

      {!isLoading && !error && reviewList.length > 0 && (
        <Paper
          elevation={2}
          sx={{
            p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 1, borderRadius: 2, width: 'auto',
            mb: 2,
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>평균:</Typography>
          <Rating name="average-rating-display" value={averageRating} precision={0.1} readOnly size="large" />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', ml:0.5 }}>{averageRating}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>/ 5</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>({reviewList.length}개)</Typography>
        </Paper>
      )}

      {/* 리뷰 작성 폼 */}
      {/* ⭐ ReviewForm에 restaurantId를 전달합니다. */}
      <ReviewForm onAddReview={handleAddReview} restaurantId={restaurantId} />

      <Divider sx={{ width: '100%', my: 3 }} />

      {/* 로딩 및 에러 UI */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, gap: 1, flexDirection: 'column' }}>
          <CircularProgress />
          <Typography>리뷰 목록 로딩 중...</Typography>
        </Box>
      )}
      {error && !isLoading && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 리뷰 목록 */}
      {!isLoading && !error && (
        <ReviewList reviewList={reviewList} />
      )}
      {!isLoading && !error && reviewList.length === 0 && (
        <Typography sx={{mt: 2, color: 'text.secondary'}}>아직 작성된 리뷰가 없습니다. 첫 리뷰를 남겨주세요!</Typography>
      )}
    </Box>
  );
};

export default ReviewPage;