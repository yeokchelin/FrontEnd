// src/pages/review/ReviewPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Divider, Rating, Paper, CircularProgress, Alert, Button } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReviewList from '../../components/reviews/ReviewList';
import ReviewForm from '../../components/reviews/ReviewForm';
import axios from 'axios';

// ★★★ 이 부분이 /api/reviews 인지 확인 (ReviewController의 @RequestMapping과 일치) ★★★
const API_BASE_URL = '/api/reviews'; 

const ReviewPage = ({ restaurant, onBack, currentUserId, currentUserNickname, currentUserAvatarUrl, isLoggedIn }) => {
    const [reviewList, setReviewList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const restaurantId = restaurant ? restaurant.id : null;
    const restaurantName = restaurant ? restaurant.name : "알 수 없는 식당";

    const fetchReviews = useCallback(async () => {
        if (!restaurantId) {
            setError("리뷰를 불러올 식당 정보가 없습니다.");
            setReviewList([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // ★★★ 이 부분이 /byStore/${restaurantId} 인지 확인 (ReviewController의 @GetMapping과 일치) ★★★
            const response = await axios.get(`${API_BASE_URL}/byStore/${restaurantId}`);
            const sortedReviews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setReviewList(sortedReviews);
        } catch (err) {
            console.error(`[ReviewPage] restaurantId '${restaurantId}' 리뷰 목록 로딩 실패:`, err.response?.data || err);
            setError("리뷰 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
            setReviewList([]);
        } finally {
            setIsLoading(false);
        }
    }, [restaurantId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleAddReview = async (formDataFromChild) => {
        if (!isLoggedIn) {
            alert("리뷰를 작성하려면 로그인해야 합니다.");
            return;
        }
        if (!restaurantId) {
            alert("리뷰를 작성할 식당 정보가 올바르지 않습니다.");
            return;
        }

        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("로그인 토큰이 없어 리뷰를 등록할 수 없습니다. 다시 로그인해 주세요.");
            return;
        }

        const newReviewPayload = {
        userId: currentUserId,
        author: currentUserNickname,
        title: formDataFromChild.title,
        content: formDataFromChild.content,
        rate: formDataFromChild.rate,
        restaurantId: restaurantId
    };
    console.log("리뷰 등록 payload:", newReviewPayload);

        try {
            // POST 요청은 여전히 /api/reviews 로 보냅니다.
            await axios.post(API_BASE_URL, newReviewPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('리뷰가 성공적으로 등록되었습니다!');
            fetchReviews();
        } catch (err) {
            console.error("리뷰 등록 실패:", err.response?.data || err);
            const errorMessage = err.response?.data?.message || err.message || "리뷰 등록 중 오류가 발생했습니다.";
            if (err.response && err.response.status === 403) {
                alert("리뷰를 등록할 권한이 없습니다. 로그인 상태를 확인해 주세요.");
            } else if (err.response && err.response.status === 401) {
                alert("인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.");
            } else {
                alert(`리뷰 등록 실패: ${errorMessage}`);
            }
        }
    };

    const averageRating = reviewList.length > 0
        ? parseFloat((reviewList.reduce((sum, item) => sum + item.rate, 0) / reviewList.length).toFixed(1))
        : 0;

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
    console.log('ReviewPage received props:', {
  isLoggedIn, currentUserId, currentUserNickname, currentUserAvatarUrl
});


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
                {restaurantName} 리뷰
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

            <ReviewForm
                onAddReview={handleAddReview}
                restaurantId={restaurantId}
                currentUserId={currentUserId}
                currentUserNickname={currentUserNickname}
                currentUserAvatarUrl={currentUserAvatarUrl}
                isLoggedIn={isLoggedIn}
            />

            <Divider sx={{ width: '100%', my: 3 }} />

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