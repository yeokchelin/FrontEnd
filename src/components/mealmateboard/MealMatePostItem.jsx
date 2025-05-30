// src/components/mealmateboard/MealMatePostItem.jsx
import React from 'react';
import { Card, CardHeader, CardContent, Typography, Box, Chip, IconButton, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
    <Typography variant="body2" component="span" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
      {label}:
    </Typography>
    <Typography variant="body2" component="span" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>
      {value}
    </Typography>
  </Box>
);

const MealMatePostItem = ({ postItem, onDelete }) => { // onDelete prop 추가
  const theme = useTheme();

  if (!postItem) {
    return null;
  }

  const {
    id,
    title = "제목 없음",
    writer = "익명", // 백엔드 DTO의 writer 필드 사용
    meetingStation = "미정",
    meetingTime = "미정",
    content = "내용 없음",
    status = "정보 없음",
    recruitCount, // 백엔드 DTO의 recruitCount 필드 사용
    preferredGender, // 백엔드 DTO의 preferredGender 필드 사용
    createdAt
  } = postItem;

  const isRecruiting = status === '모집 중';

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2.5,
        bgcolor: 'background.paper',
        borderRadius: 2.5,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
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
            sx={{ fontWeight: 'medium', mt:0.5 }}
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
            minHeight: '4.8em' // 약 3줄 높이
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt:0, pb:1, px:1.5 }}>
        {/* <IconButton size="small" aria-label="edit post">
          <EditIcon />
        </IconButton> */}
        <IconButton size="small" onClick={() => onDelete(id)} aria-label="delete post" title="게시글 삭제">
          <DeleteIcon color="error" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MealMatePostItem;