// src/components/review/ReviewForm.jsx
import React, { useState, useRef } from 'react'; // useRef 추가 (파일 입력 초기화용)
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Rating, // MUI Rating 컴포넌트
  IconButton // 이미지 제거 버튼용
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // 이미지 선택 버튼 아이콘
import ClearIcon from '@mui/icons-material/Clear';         // 이미지 제거 아이콘
import { useTheme } from '@mui/material/styles';         // 테마 직접 접근 (이미지 미리보기 테두리용)

// './ReviewForm.css' 임포트는 더 이상 필요 없습니다.

export default function ReviewForm({ onAddReview }) {
  const theme = useTheme(); // 테마 객체 가져오기
  const [authorName, setAuthorName] = useState('');
  const [ratingValue, setRatingValue] = useState(0); // Rating 컴포넌트는 숫자 값을 사용 (0은 선택 안 함)
  const [commentText, setCommentText] = useState('');
  const [imageFile, setImageFile] = useState(null); // 실제 파일 객체 저장 (올바르게 수정)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const fileInputRef = useRef(null); // 파일 입력 DOM 요소 참조

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!authorName || !commentText || ratingValue === 0) {
      alert('작성자, 별점(1점 이상), 내용을 모두 입력해주세요.');
      return;
    }

    const newReview = {
      id: Date.now(),
      authorName,
      ratingValue, // 숫자 값 그대로 전달
      commentText,
      reviewDate: new Date().toISOString(),
      imageUrl: imagePreviewUrl,
      // 실제 파일 업로드가 필요하다면 imageFile 객체도 함께 전달해야 합니다.
      // imageFile: imageFile,
    };

    onAddReview(newReview);

    // 폼 초기화
    setAuthorName('');
    setRatingValue(0);
    setCommentText('');
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 파일 입력 필드 값 초기화
    }
  };

  // Rating 컴포넌트의 onChange 핸들러에서 직접 setRatingValue 호출
  // const handleRatingChange = (newRating) => {
  //   setRatingValue(newRating);
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // 파일 객체 상태에 저장
      setImagePreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 파일 입력 필드 값 초기화
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        mt: 4, mb: 4,
        maxWidth: '700px',
        ml: 'auto', mr: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 3, // 각 폼 요소들 사이의 간격을 늘림
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 1 }}>
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

      {/* 별점 입력 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography component="label" htmlFor="review-rating" gutterBottom sx={{ fontWeight: 'medium', color: 'text.secondary', mb: 0.5 }}>
          별점<span style={{color: theme.palette.error.main}}>*</span>
        </Typography>
        <Rating
          name="ratingValue"
          id="review-rating"
          value={ratingValue}
          onChange={(event, newValue) => {
            setRatingValue(newValue === null ? 0 : newValue); // 사용자가 별을 다시 클릭해 선택 취소하면 null이 될 수 있음
          }}
          precision={0.5} // 0.5로 하면 반 별점 가능
          size="medium"  // 별 크기 L, M, S
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

      {/* 사진 첨부 */}
      <Box>
        <Typography component="label" gutterBottom sx={{ fontWeight: 'medium', color: 'text.secondary', display:'block', mb: 0.5 }}>
          사진 첨부 (선택 사항)
        </Typography>
        <Button
          variant="outlined"
          component="label" // 이 버튼이 숨겨진 input의 label 역할을 하도록 함
          startIcon={<PhotoCamera />}
          fullWidth
          sx={{ justifyContent: 'flex-start', color: 'text.secondary' }} // 버튼 내부 텍스트 왼쪽 정렬
        >
          이미지 선택...
          <input
            type="file"
            id="imageFile" // label의 htmlFor와 연결되지 않아도 component="label"로 작동
            hidden // 실제 input 요소는 숨김
            accept="image/*" // 이미지 파일만 선택 가능하도록
            onChange={handleImageChange}
            ref={fileInputRef} // 파일 입력 초기화를 위해 ref 연결
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
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.5)', // 배경을 약간 어둡게 하여 아이콘이 잘 보이도록
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
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
        sx={{ mt: 2 }}
      >
        리뷰 제출
      </Button>
    </Paper>
  );
};