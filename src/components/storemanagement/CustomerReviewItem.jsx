// src/components/storemanagement/CustomerReviewItem.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Rating, TextField, Button, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';     // 답글 수정 아이콘
import SendIcon from '@mui/icons-material/Send';       // 답글 제출 아이콘
import CancelIcon from '@mui/icons-material/Cancel';   // 답글 취소 아이콘
// import { useTheme } from '@mui/material/styles';     // 테마 직접 사용시 주석 풀고 사용

// './CustomerReviewItem.css' 임포트는 더 이상 필요 없습니다.

const CustomerReviewItem = ({ review, onReplySubmit }) => {
  // const theme = useTheme(); // 현재 테마 객체 적용 시 주석 풀고 사용

  // review.ownerReply가 존재하고 그 안에 text가 있으면 그 값을, 아니면 빈 문자열로 초기화
  const initialReplyText = review.ownerReply && review.ownerReply.text ? review.ownerReply.text : '';
  const [replyText, setReplyText] = useState(initialReplyText);

  // 초기 isReplying 상태: 답글이 없거나, 답글 텍스트가 비어있으면 true (답글 작성 모드 시작)
  const [isReplying, setIsReplying] = useState(!review.ownerReply || !review.ownerReply.text);

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') {
      alert('답글 내용을 입력해주세요.');
      return;
    }
    onReplySubmit(review.id, replyText); // 부모 컴포넌트로 답글 데이터 전달
    setIsReplying(false); // 답글 제출 후 보기 모드로 전환
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 2.5 }, // 내부 패딩
        mb: 3,                // 아이템 간 하단 마진
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      {/* 고객 리뷰 섹션 */}
      <Box className="review-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" component="strong" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {review.customerName || "익명"}
        </Typography>
        {typeof review.rating === 'number' && review.rating > 0 && ( // rating 값이 유효한 숫자인 경우에만 표시
          <Rating name="customer-rating-display" value={review.rating} readOnly size="small" precision={0.5} />
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        작성일: {formatDate(review.createdAt)}
      </Typography>
      <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 2, lineHeight: 1.7 }}>
        {review.text || "리뷰 내용이 없습니다."}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* 사장님 답글 표시 또는 수정/작성 폼 */}
      {review.ownerReply && review.ownerReply.text && !isReplying && (
        <Box className="owner-reply-display" sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1.5 }}>
          <Typography variant="subtitle2" component="h4" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
            사장님 답글:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'text.secondary', mb: 1 }}>
            {review.ownerReply.text}
          </Typography>
          {review.ownerReply.repliedAt && (
            <Typography variant="caption" color="text.disabled" display="block" sx={{ textAlign: 'right' }}>
              답글 작성일: {formatDate(review.ownerReply.repliedAt)}
            </Typography>
          )}
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setReplyText(review.ownerReply.text); // 수정 시작 시 기존 답글 내용으로 설정
              setIsReplying(true);
            }}
            startIcon={<EditIcon fontSize="small" />}
            sx={{ mt: 1, display: 'block', ml: 'auto', color: 'text.secondary' }}
          >
            답글 수정
          </Button>
        </Box>
      )}

      {isReplying && (
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
            label={review.ownerReply && review.ownerReply.text ? "답글 수정하기" : "답글 작성하기"}
          />
          <Box className="reply-form-actions" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            {/* 수정 중이거나, 새 답글인데 내용이 입력된 경우 '취소' 버튼 표시 */}
            {(review.ownerReply && review.ownerReply.text) || (!review.ownerReply && replyText.trim() !== '') ? (
              <Button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText(initialReplyText); // 취소 시 원래 답글 내용 또는 빈 문자열로 복원
                }}
                variant="outlined"
                size="small"
                startIcon={<CancelIcon fontSize="small"/>}
              >
                취소
              </Button>
            ) : null}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SendIcon fontSize="small"/>}
            >
              {review.ownerReply && review.ownerReply.text ? '답글 수정 완료' : '답글 달기'}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default CustomerReviewItem;