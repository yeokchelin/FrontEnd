// src/components/review/ReviewForm.jsx
import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Rating,
  IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';

// ❗️ storeId를 props로 받는다고 가정합니다.
export default function ReviewForm({ onAddReview, storeId }) {
  const theme = useTheme();
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState(''); // ❗️ 리뷰 제목 상태 추가
  const [ratingValue, setRatingValue] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // ❗️ 제목(title) 필드도 유효성 검사에 포함
    if (!authorName.trim() || !title.trim() || !commentText.trim() || ratingValue === 0) {
      alert('작성자, 제목, 별점(1점 이상), 내용을 모두 입력해주세요.');
      return;
    }
    // ❗️ storeId가 유효한지 확인 (prop으로 받았다고 가정)
    if (!storeId) {
        alert('리뷰 대상 가게 정보가 없습니다. 다시 시도해주세요.');
        return;
    }

    const newReviewData = {
      // id는 백엔드에서 자동 생성되므로 여기서 보내지 않음
      authorName,
      title, // ❗️ 추가
      ratingValue,
      commentText,
      imageUrl: imagePreviewUrl,
      storeId, // ❗️ 추가 (리뷰 대상 ID)
      // reviewDate는 백엔드에서 createdAt으로 자동 생성됨
      // imageFile은 실제 파일 업로드 로직에서 사용 (여기서는 imageUrl만 전달)
    };

    onAddReview(newReviewData); // 부모 컴포넌트(ReviewPage)의 API 호출 함수 실행

    // 폼 초기화
    setAuthorName('');
    setTitle(''); // ❗️ 추가
    setRatingValue(0);
    setCommentText('');
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        mt: 2, // 다른 폼들과의 일관성을 위해 mt를 약간 줄임 (페이지에서 조절 가능)
        mb: 4,
        maxWidth: '700px',
        ml: 'auto', mr: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5, // 각 폼 요소들 사이의 간격을 이전보다 약간 줄임 (선택적)
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        리뷰 작성하기
      </Typography>

      <TextField
        label="작성자"
        id="authorName"
        value={authorName}
        onChange={(event) => setAuthorName(event.target.value)}
        required
        fullWidth
        variant="outlined"
      />

      {/* ❗️ 리뷰 제목 입력 필드 추가 */}
      <TextField
        label="리뷰 제목"
        id="reviewTitle"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        fullWidth
        variant="outlined"
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography component="label" htmlFor="review-rating" gutterBottom sx={{ fontWeight: 'medium', color: 'text.secondary', mb: 0.5 }}>
          별점<span style={{color: theme.palette.error.main}}>*</span>
        </Typography>
        <Rating
          name="ratingValue"
          id="review-rating"
          value={ratingValue}
          onChange={(event, newValue) => {
            setRatingValue(newValue === null ? 0 : newValue);
          }}
          precision={0.5}
          size="large" // 이전 코드에서는 medium이었으나, 사용자가 large로 요청했을 수 있어 유지
        />
      </Box>

      <TextField
        label="리뷰 내용"
        id="commentText"
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        required
        fullWidth
        multiline
        rows={5}
        variant="outlined"
      />

      <Box>
        <Typography component="label" gutterBottom sx={{ fontWeight: 'medium', color: 'text.secondary', display:'block', mb: 0.5 }}>
          사진 첨부 (선택 사항)
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          fullWidth
          sx={{ justifyContent: 'flex-start', color: 'text.secondary', py:1.2 }}
        >
          이미지 선택...
          <input
            type="file"
            id="imageFile"
            hidden
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </Button>
        {imagePreviewUrl && (
          <Box sx={{ mt: 2, textAlign: 'center', position: 'relative', border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p:1 }}>
            <img
              src={imagePreviewUrl}
              alt="이미지 미리보기"
              style={{ display: 'block', maxHeight: '250px', maxWidth: '100%', borderRadius: '4px', margin: 'auto' }}
            />
            <IconButton
              onClick={handleRemoveImage}
              size="small"
              sx={{
                position: 'absolute', top: 8, right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.6)', color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
              }}
              aria-label="사진 삭제"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2, py: 1.2 }}
      >
        리뷰 제출
      </Button>
    </Paper>
  );
};