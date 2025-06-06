// src/components/reviews/ReviewForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Rating, Button, Paper, Typography, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';

const UserAvatar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'avatarUrl'
})(({ theme, avatarUrl }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[300],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: theme.palette.grey[600],
  },
  // avatarUrl을 이용해 동적으로 배경이미지 등 사용하고 싶으면 여기에 스타일 추가
}));


// props에 currentUserId, currentUserNickname, currentUserAvatarUrl, isLoggedIn 추가
export default function ReviewForm({ onAddReview, restaurantId, currentUserId, currentUserNickname, currentUserAvatarUrl, isLoggedIn }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rate, setRate] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 로그인 상태 변화 또는 식당 변경 시 폼 초기화
    useEffect(() => {
        // 로그인 상태가 변경되거나, 다른 식당으로 상세 페이지가 변경될 때 폼 초기화
        setTitle('');
        setContent('');
        setRate(0);
        setIsSubmitting(false);
    }, [restaurantId, isLoggedIn]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 폼 제출 시 isLoggedIn 최종 확인
        if (!isLoggedIn) {
            alert("로그인 후 리뷰를 작성할 수 있습니다.");
            return;
        }

        if (rate === 0) {
            alert("별점을 선택해주세요.");
            return;
        }
        if (content.trim() === '') {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }
        if (!restaurantId) {
            alert("리뷰를 작성할 식당 정보가 없습니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            // onAddReview 함수가 JWT 토큰을 자체적으로 처리하도록 설계되었으므로, 여기서는 페이로드만 전달
            await onAddReview({ title, content, rate, userId: currentUserId, author: currentUserNickname }); // title 필드를 백엔드에 보내려면 ReviewPage의 handleAddReview에서도 처리해야 함
            
            // 폼 필드 초기화 (성공 시에만)
            setTitle('');
            setContent('');
            setRate(0);
        } catch (error) {
            // onAddReview에서 에러 메시지를 처리하므로 여기서는 추가적인 alert 생략
            console.error("리뷰 폼 제출 오류:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 폼 전체를 비활성화할지 여부: 로그인하지 않았거나 제출 중일 때 비활성화
    const isDisabled = !isLoggedIn || isSubmitting;

    console.log('ReviewForm received props:', {
  isLoggedIn, currentUserId, currentUserNickname, currentUserAvatarUrl
});

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                리뷰 작성
            </Typography>
            {/* 로그인 안내 메시지 */}
            {!isLoggedIn && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    리뷰를 작성하려면 <Typography component="span" fontWeight="bold">로그인</Typography>이 필요합니다.
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* 사용자 정보 (아바타, 닉네임) 표시 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserAvatar avatarUrl={currentUserAvatarUrl}>
                            {currentUserAvatarUrl ? <img src={currentUserAvatarUrl} alt="User Avatar" /> : <AccountCircleIcon />}
                        </UserAvatar>
                        <Typography variant="body1" fontWeight="medium">
                            {isLoggedIn ? currentUserNickname : "비회원"}
                        </Typography>
                    </Box>

                    {/* 제목 필드 */}
                    <TextField
                        label="리뷰 제목"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={isDisabled} // 로그인하지 않았거나 제출 중일 때 비활성화
                        placeholder={isLoggedIn ? "" : "로그인 후 작성할 수 있습니다."}
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
                        disabled={isDisabled} // 로그인하지 않았거나 제출 중일 때 비활성화
                        placeholder={isLoggedIn ? "이 식당에 대한 솔직한 리뷰를 남겨주세요!" : "로그인 후 작성할 수 있습니다."}
                    />
                    {/* 별점 필드 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="legend">별점</Typography>
                        <Rating
                            name="review-rating"
                            value={rate}
                            precision={1}
                            onChange={(event, newValue) => {
                                setRate(newValue);
                            }}
                            required
                            disabled={isDisabled} // 로그인하지 않았거나 제출 중일 때 비활성화
                        />
                        {rate > 0 && <Typography variant="body2">({rate}점)</Typography>}
                    </Box>
                    {/* 제출 버튼 */}
                    <Button
                        type="submit"
                        variant="contained"
                        endIcon={<SendIcon />}
                        disabled={isDisabled} // 로그인하지 않았거나 제출 중일 때 비활성화
                        sx={{ mt: 2, py: 1.5 }}
                    >
                        리뷰 등록
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}