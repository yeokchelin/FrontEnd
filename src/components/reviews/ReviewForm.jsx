// src/components/reviews/ReviewForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Rating, Button, Paper, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// ⭐ prop명 변경: storeId -> restaurantId
const ReviewForm = ({ onAddReview, restaurantId }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rate, setRate] = useState(0); // 별점 상태: 0부터 시작, Integer에 맞춰 0으로 초기화

  // ⭐ restaurantId가 변경될 때마다 폼 초기화
  useEffect(() => {
    // setAuthor(''); // 필요한 경우 작성자도 초기화
    setTitle('');
    setContent('');
    setRate(0);
  }, [restaurantId]); // ⭐ 의존성 배열 변경: storeId -> restaurantId

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!author.trim()) {
        alert("작성자를 입력해주세요.");
        return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (rate === 0) { // 별점 필수 (0점은 유효하지 않다고 가정)
        alert("별점을 선택해주세요.");
        return;
    }
    if (!restaurantId) { // ⭐ 변수명 변경: storeId -> restaurantId
        alert("리뷰를 작성할 식당 정보가 없습니다.");
        return;
    }

    // 부모 컴포넌트로 리뷰 데이터 전달
    // ReviewPage에서 restaurantId를 이미 추가하고 있으므로, 여기서는 기본 폼 데이터만 전달합니다.
    onAddReview({ author, title, content, rate });

    // 폼 필드 초기화
    setAuthor('');
    setTitle('');
    setContent('');
    setRate(0);
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
        리뷰 작성
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 작성자 필드 */}
          <TextField
            label="작성자"
            variant="outlined"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          {/* 제목 필드 */}
          <TextField
            label="리뷰 제목"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {/* 내용 필드 */}
          <TextField
            label="리뷰 내용"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {/* 별점 필드 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component="legend">별점</Typography>
            <Rating
              name="review-rating"
              value={rate}
              precision={1} // 별점을 정수 단위로 받도록 설정
              onChange={(event, newValue) => {
                setRate(newValue);
              }}
              required
            />
            {rate > 0 && <Typography variant="body2">({rate}점)</Typography>}
          </Box>
          {/* 제출 버튼 */}
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ mt: 2, py: 1.5 }}
          >
            리뷰 등록
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ReviewForm;