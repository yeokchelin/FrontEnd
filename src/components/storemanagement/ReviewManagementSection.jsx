// src/components/storemanagement/ReviewManagementSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Divider, CircularProgress, Alert } from '@mui/material';
import CustomerReviewItem from './CustomerReviewItem';
import axios from 'axios';

const API_BASE_URL = '/api'; // 백엔드 API 기본 URL

// storeId와 currentUserId prop을 받도록 수정합니다.
const ReviewManagementSection = ({ storeId, currentUserId }) => {
  const [reviews, setReviews] = useState([]); // reviews 상태는 초기값을 빈 배열로 가집니다.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 특정 가게의 리뷰를 불러오는 함수
  const fetchReviews = useCallback(async () => {
    if (!storeId) {
      setIsLoading(false);
      setError("관리할 가게 ID가 없습니다. 가게 정보를 확인해주세요.");
      setReviews([]); // storeId가 없을 때도 빈 배열로 설정하여 map 오류 방지
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/byStore/${storeId}`);
      
      // ★★★ 핵심 수정: response.data가 배열인지 확인하고 설정 ★★★
      if (Array.isArray(response.data)) {
        setReviews(response.data); // 응답 데이터가 배열이면 그대로 사용
      } else {
        // 백엔드에서 배열이 아닌 다른 형태(예: null, 객체 등)가 왔을 때 경고를 띄우고 빈 배열로 처리합니다.
        console.warn("[ReviewManagementSection] 백엔드에서 리뷰 목록이 배열이 아닌 형태로 왔습니다:", response.data);
        setReviews([]); // reviews를 빈 배열로 설정하여 map() 오류 방지
      }
    } catch (err) {
      console.error(`[ReviewManagementSection] 리뷰 로딩 실패 (Store ID: ${storeId}):`, err.response || err.message || err);
      const errorMessage = err.response?.data?.message || err.message || "리뷰를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      setReviews([]); // 오류 발생 시에도 reviews를 빈 배열로 설정
    } finally {
      setIsLoading(false);
    }
  }, [storeId]); // storeId가 변경될 때마다 fetchReviews가 다시 실행됩니다.

  // 컴포넌트 마운트 및 storeId 변경 시 리뷰 불러오기
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // fetchReviews가 useCallback으로 감싸져 있으므로 안전합니다.


  const handleReplySubmit = useCallback(async (reviewId, replyText) => {
    // currentUserId는 Mypage에서 currentUserId를 받아오는 로직이 필요합니다.
    // 여기서는 ReviewManagementSection이 Mypage에서 currentUserId를 prop으로 받는다고 가정합니다.
    if (!currentUserId) { // currentUserId가 없으면 로그인 안 된 것으로 간주
        alert("로그인 정보가 없거나 점주가 아닙니다. 답글을 작성할 수 없습니다.");
        return;
    }
    if (!replyText.trim()) {
        alert("답글 내용을 입력해주세요.");
        return;
    }

    try {
        // PATCH /api/reviews/{reviewId}/reply 엔드포인트 호출
        // RequestBody는 String replyContent이므로, 'replyText' 문자열을 직접 보냅니다.
        // 백엔드에서 인증 컨텍스트를 통해 점주 권한을 확인한다고 가정합니다.
        await axios.patch(`${API_BASE_URL}/reviews/${reviewId}/reply`, replyText, {
            headers: {
                'Content-Type': 'text/plain' // @RequestBody String을 받을 때 Content-Type을 text/plain으로 명시 (선택적)
            }
        });
        
        alert('답글이 등록되었습니다!');
        fetchReviews(); // 답글 등록 후 리뷰 목록 새로고침 (답글 포함)
    } catch (err) {
        console.error(`[ReviewManagementSection] 답글 등록 실패 (Review ID: ${reviewId}):`, err.response || err.message || err);
        const errorMessage = err.response?.data?.message || err.message || "답글 등록 중 오류가 발생했습니다.";
        alert(`답글 등록 실패: ${errorMessage}`);
    }
  }, [currentUserId, fetchReviews]);


  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        my: { xs: 3, sm: 4 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: '100%',
        maxWidth: '900px',
        mx: 'auto',
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          color: 'text.primary',
          fontWeight: 'medium',
          textAlign: 'center',
          mb: 3,
        }}
      >
        고객 리뷰 관리
      </Typography>

      {/* 로딩 상태 표시 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>리뷰를 불러오는 중...</Typography>
        </Box>
      ) : error ? ( // 에러 상태 표시
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : reviews.length === 0 ? ( // 리뷰가 없을 때 메시지
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: { xs: 4, sm: 6 },
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.secondary', fontStyle: 'italic' }}
          >
            아직 등록된 고객 리뷰가 없습니다.
          </Typography>
        </Box>
      ) : ( // 리뷰 목록 표시
        <Box className="review-list" sx={{ width: '100%' }}>
          {/* reviews가 배열임이 보장되므로 map() 안전하게 사용 */}
          {reviews.map((review, index) => (
            <React.Fragment key={review.reviewId}> {/* review.reviewId 사용 */}
              <CustomerReviewItem
                review={review}
                onReplySubmit={handleReplySubmit}
                currentUserId={currentUserId} // currentUserId 전달
                storeId={storeId} // storeId 전달
              />
              {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />} {/* 각 리뷰 사이에 구분선 */}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ReviewManagementSection;