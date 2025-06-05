// src/components/mealmateboard/MealMatePostItem.jsx
import React from 'react';
import { Card, CardHeader, CardContent, Typography, Box, Chip, IconButton, CardActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import WcIcon from '@mui/icons-material/Wc';
import { useTheme } from '@mui/material/styles';

const formatSimpleDate = (isoString) => {
  if (!isoString) return '날짜 정보 없음';
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};

const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8, gap: 0.8 }}>
    {React.cloneElement(icon, { sx: { fontSize: '1.1rem', color: 'text.secondary' } })}
    <Typography variant="body2" component="span" sx={{ fontWeight: 'medium', color: 'text.secondary', whiteSpace: 'nowrap' }}>
      {label}:
    </Typography>
    <Typography variant="body2" component="span" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>
      {value}
    </Typography>
  </Box>
);

const MealMatePostItem = ({ postItem, onDelete, onPostClick, currentUserId, onSetStatusCompleted, onEditPost }) => {
  const theme = useTheme();

  if (!postItem) return null;

  const {
    id,
    title = "제목 없음",
    writer = "익명", // ❗️ 이 필드와 currentUserId를 비교합니다.
    meetingStation = "미정",
    meetingTime = "미정",
    content = "내용 없음",
    status = "정보 없음", // ❗️ 이 필드로 "모집 중" 여부 판단
    recruitCount,
    preferredGender,
    createdAt
  } = postItem;

  const isRecruiting = status === '모집 중';
  // ❗️ 중요: isAuthor 조건이 올바르게 평가되는지 확인
  //    실제 서비스에서는 postItem.authorId 와 currentUserId (또는 currentUser.id) 와 같이 고유 ID로 비교해야 합니다.
  const isAuthor = currentUserId === writer;

  // 디버깅 로그 (필요시 주석 해제하여 값 확인)
  // console.log(`[MealMatePostItem ID: ${id}] Render. isAuthor: ${isAuthor}, currentUserId: ${currentUserId}, writer: ${writer}, isRecruiting: ${isRecruiting}, status: ${status}`);
  // console.log(`[MealMatePostItem ID: ${id}] Props: onDelete: ${!!onDelete}, onSetStatusCompleted: ${!!onSetStatusCompleted}, onEditPost: ${!!onEditPost}`);


  const handleCardClick = (e) => {
    // 버튼/아이콘 버튼 클릭 시에는 카드 전체 클릭(상세보기 이동)이 발생하지 않도록 함
    if (e.target.closest('button, [role="button"]')) {
      return;
    }
    if (onPostClick) {
      onPostClick(postItem);
    }
  };

  return (
    <Card
      elevation={2}
      onClick={handleCardClick}
      sx={{
        mb: 2.5,
        bgcolor: 'background.paper',
        borderRadius: 2.5,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
          cursor: onPostClick ? 'pointer' : 'default',
        },
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25, display: 'block' }}>
            {`작성자: ${writer} | 작성일: ${formatSimpleDate(createdAt)}`}
          </Typography>
        }
        action={
          <Chip
            label={status}
            color={isRecruiting ? "success" : "default"}
            size="small"
            sx={{ fontWeight: 'medium', mt: 0.5 }}
          />
        }
        sx={{ pb: 1, alignItems: 'flex-start' }}
      />
      <CardContent sx={{ pt: 0.5 }}>
        <Box className="meeting-info" sx={{ mb: 2, mt: 1, p:1.5, bgcolor: 'action.hover', borderRadius: 1.5 }}>
          <DetailItem icon={<LocationOnIcon />} label="만날 역" value={meetingStation} />
          <DetailItem icon={<AccessTimeIcon />} label="만날 시간" value={meetingTime} />
          <DetailItem icon={<GroupIcon />} label="모집 인원" value={`${recruitCount != null ? recruitCount : '?'}명`} />
          <DetailItem icon={<WcIcon />} label="선호 성별" value={preferredGender} />
        </Box>
        <Typography
          variant="body1"
          component="p"
          sx={{
            color: 'text.primary',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.6,
            mb: 1,
            minHeight: '4.8em',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', alignItems:'center', pt:0, pb:1, px:1.5 }}>
        <Box> {/* 왼쪽 버튼 그룹 (모집 완료 버튼) */}
          {/* "모집 완료" 버튼 조건: 작성자 본인이고, "모집 중" 상태이고, onSetStatusCompleted 함수가 전달되었을 때 */}
          {isAuthor && isRecruiting && typeof onSetStatusCompleted === 'function' && (
            <Button
              variant="outlined"
              size="small"
              color="success"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={(e) => {
                e.stopPropagation(); // 카드 전체 클릭 이벤트 전파 방지
                onSetStatusCompleted(id);
              }}
              title="모집 완료로 상태 변경"
            >
              모집 완료
            </Button>
          )}
        </Box>
        <Box sx={{display: 'flex', gap: 0.5}}> {/* 오른쪽 버튼 그룹 (수정, 삭제 버튼) */}
          {/* "글 수정" 버튼 조건: 작성자 본인이고, onEditPost 함수가 전달되었고, "모집 중" 상태일 때 활성화 */}
          {isAuthor && typeof onEditPost === 'function' && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onEditPost(postItem); }}
              aria-label="edit post"
              title="게시글 수정"
              disabled={!isRecruiting} // "모집 완료" 시 수정 불가
            >
              <EditIcon fontSize="small"/>
            </IconButton>
          )}
          {/* "삭제" 버튼 조건: 작성자 본인이고, onDelete 함수가 전달되었을 때 */}
          {isAuthor && typeof onDelete === 'function' && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              aria-label="delete post"
              title="게시글 삭제"
            >
              <DeleteIcon color="error" fontSize="small"/>
            </IconButton>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default MealMatePostItem;