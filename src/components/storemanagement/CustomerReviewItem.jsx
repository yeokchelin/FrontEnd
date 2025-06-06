// src/components/storemanagement/CustomerReviewItem.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import { Box, Typography, Paper, Rating, TextField, Button, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
// import { useTheme } from '@mui/material/styles'; // 테마 직접 사용시 주석 풀고 사용

// review, onReplySubmit 외에 currentUserId, storeId props 추가
const CustomerReviewItem = ({ review, onReplySubmit, currentUserId, storeId }) => { // ★★★ props 추가 ★★★
  // const theme = useTheme();

  // 백엔드 ReviewResponseDto의 ownerReplyContent 필드와 매칭
  const initialReplyContent = review.ownerReplyContent || '';
  const [replyText, setReplyText] = useState(initialReplyContent);

  // 현재 사용자가 점주인지 판단하는 상태
  const [isOwner, setIsOwner] = useState(false);
  // 답글 작성/수정 모드 상태 (답글이 없거나 비어있으면 초기 작성 모드)
  const [isReplying, setIsReplying] = useState(false); // 초기에는 보기 모드, 필요시 편집 모드로 전환

  // 컴포넌트 로드 시 또는 review/currentUserId 변경 시 점주 여부 확인
  useEffect(() => {
    // review.restaurant.store.kakaoId를 통해 점주의 kakaoId를 가져와 currentUserId와 비교
    // review.restaurant.store.kakaoId는 백엔드 ReviewResponseDto를 통해 전달되어야 합니다.
    const reviewOwnerKakaoId = review.restaurant?.store?.kakaoId; // 체이닝 연산자 사용

    // currentUserId가 유효하고, reviewOwnerKakaoId와 일치하면 점주
    const isCurrentUserOwner = currentUserId !== null && reviewOwnerKakaoId && String(currentUserId) === String(reviewOwnerKakaoId);
    setIsOwner(isCurrentUserOwner);

    // 답글이 없고 점주인 경우 자동으로 답글 작성 모드로 전환
    if (isCurrentUserOwner && !review.ownerReplyContent) {
        setIsReplying(true);
    } else {
        setIsReplying(false); // 답글이 있거나 점주가 아니면 보기 모드
    }
    setReplyText(initialReplyContent); // 답글 내용 초기화 (새로 로드될 때마다)
  }, [review, currentUserId, initialReplyContent]); // review 객체 자체가 변경될 때도 useEffect 재실행


  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') {
      alert('답글 내용을 입력해주세요.');
      return;
    }
    // onReplySubmit 함수에 review.reviewId와 답글 텍스트 전달
    onReplySubmit(review.reviewId, replyText); // ★★★ review.id -> review.reviewId 변경 ★★★
    // 답글 제출 후에는 ReviewManagementSection에서 fetchReviews를 통해 최신 상태를 가져올 것이므로
    // 여기서는 isReplying 상태만 보기 모드로 전환
    setIsReplying(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // 백엔드 LocalDateTime은 ISO 문자열이므로 new Date()로 파싱
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      {/* 고객 리뷰 섹션 */}
      <Box className="review-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {/* review.author는 고객 리뷰 작성자 */}
        <Typography variant="subtitle1" component="strong" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {review.author || "익명"}
        </Typography>
        {typeof review.rate === 'number' && review.rate > 0 && ( // review.rate 값 사용
          <Rating name="customer-rating-display" value={review.rate} readOnly size="small" precision={0.5} />
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        작성일: {formatDate(review.createdAt)}
      </Typography>
      {/* review.content는 고객 리뷰 내용 */}
      <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 2, lineHeight: 1.7 }}>
        {review.content || "리뷰 내용이 없습니다."}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* 사장님 답글 표시 또는 수정/작성 폼 */}
      {/* 백엔드에서 ownerReplyContent가 null이 아니면 답글이 있는 것으로 간주 */}
      {review.ownerReplyContent && !isReplying ? ( // 답글이 있고 수정 모드가 아니면 답글 표시
        <Box className="owner-reply-display" sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1.5 }}>
          <Typography variant="subtitle2" component="h4" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
            사장님 답글:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'text.secondary', mb: 1 }}>
            {review.ownerReplyContent}
          </Typography>
          {review.ownerRepliedAt && ( // ownerRepliedAt 필드 사용
            <Typography variant="caption" color="text.disabled" display="block" sx={{ textAlign: 'right' }}>
              답글 작성일: {formatDate(review.ownerRepliedAt)}
            </Typography>
          )}
          {isOwner && ( // 점주만 답글 수정 버튼 표시
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setReplyText(review.ownerReplyContent); // 수정 시작 시 기존 답글 내용으로 설정
                setIsReplying(true); // 답글 수정 모드로 전환
              }}
              startIcon={<EditIcon fontSize="small" />}
              sx={{ mt: 1, display: 'block', ml: 'auto', color: 'text.secondary' }}
            >
              답글 수정
            </Button>
          )}
        </Box>
      ) : isReplying || (isOwner && !review.ownerReplyContent) ? ( // 답글 작성/수정 폼 (점주이면서 답글이 없거나, isReplying 상태일 때)
        <Box
          component="form"
          onSubmit={handleSubmitReply}
          className="owner-reply-form"
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
        >
          <TextField
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="고객님의 소중한 리뷰에 답글을 작성해주세요."
            multiline
            rows={3}
            fullWidth
            required
            variant="outlined"
            label={review.ownerReplyContent ? "답글 수정하기" : "답글 작성하기"}
          />
          <Box className="reply-form-actions" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            {/* 수정 중이거나, 새 답글인데 내용이 입력된 경우 '취소' 버튼 표시 */}
            {isReplying && ( // 답글 작성/수정 모드일 때만 취소 버튼 표시
              <Button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText(initialReplyContent); // 취소 시 원래 답글 내용 또는 빈 문자열로 복원
                }}
                variant="outlined"
                size="small"
                startIcon={<CancelIcon fontSize="small"/>}
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SendIcon fontSize="small"/>}
            >
              {review.ownerReplyContent ? '답글 수정 완료' : '답글 달기'}
            </Button>
          </Box>
        </Box>
      ) : null} {/* 답글이 없고 점주도 아닌 경우 아무것도 표시하지 않음 */}
    </Paper>
  );
};

export default CustomerReviewItem;