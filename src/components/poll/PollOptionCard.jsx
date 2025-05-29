// src/components/poll/VoteOptionCard.jsx
import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip, // 상태 표시에 Chip을 사용해볼 수도 있습니다 (선택 사항)
  LinearProgress, // 투표율을 보여주기 위한 프로그레스 바
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // 투표 완료 아이콘
import { useTheme } from '@mui/material/styles'; // 테마 직접 접근

// './PollOptionCard.css' 임포트는 더 이상 필요 없습니다.

const VoteOptionCard = ({ option, onVote, hasVoted, userVoteId }) => {
  const theme = useTheme(); // 테마 객체 가져오기

  if (!option) return null;

  const percentage = option.totalVotes > 0 ? Math.round((option.voteCount / option.totalVotes) * 100) : 0;
  const isVotedFor = hasVoted && userVoteId === option.id;

  return (
    <Card
      sx={{
        width: { xs: '90%', sm: 280, md: 300 }, // 반응형 카드 너비
        m: 1.5, // 카드 주변 마진
        borderRadius: 2.5, // 모서리 둥글기 (테마 기본값 * 2.5)
        transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
        '&:hover': {
          transform: 'translateY(-6px)', // 호버 시 약간 떠오르는 효과
          boxShadow: theme.shadows[8],   // 호버 시 그림자 강화
        },
        border: isVotedFor ? `2px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`,
        boxShadow: isVotedFor ? `0 0 10px ${theme.palette.success.light}` : theme.shadows[3],
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column', // 카드 내부 요소들을 세로로 정렬
        height: '100%', // 부모가 flex 컨테이너일 때 높이를 채우도록 (선택 사항)
      }}
    >
      <CardMedia
        component="img"
        height="180" // 이미지 높이 고정
        image={option.imageUrl || "https://via.placeholder.com/300x180?text=No+Image"} // 이미지가 없을 경우 플레이스홀더
        alt={option.name}
        sx={{ objectFit: 'cover' }} // 이미지가 영역에 맞게 잘리거나 채워지도록
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}> {/* 내용이 카드 높이를 채우도록 */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'text.primary', wordBreak: 'break-word', minHeight: '3.5em' /* 2줄 정도 높이 확보 */ }}
        >
          {option.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph // 문단 아래에 마진 추가
          sx={{ flexGrow: 1, wordBreak: 'break-word', minHeight: '4.5em' /* 3줄 정도 높이 확보 */ }}
        >
          {option.description}
        </Typography>

        {/* 투표 수 및 퍼센티지 (투표 후 표시) */}
        <Box sx={{ mt: 'auto', width: '100%' }}> {/* 항상 CardContent 하단에 위치 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
              {option.voteCount} 표
            </Typography>
            {hasVoted && (
              <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {percentage}%
              </Typography>
            )}
          </Box>
          {hasVoted && (
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={isVotedFor ? "success" : "primary"} // 내가 투표한 항목은 success 색상
              sx={{ height: 8, borderRadius: 1, mb: 1 }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: hasVoted ? 1 : 2, justifyContent: 'center', minHeight: '52px' /* 버튼 영역 높이 확보 */ }}>
        {!hasVoted && (
          <Button
            variant="contained"
            color="primary" // 테마의 primary 색상 사용
            onClick={() => onVote(option.id)}
            fullWidth // 버튼 너비 100%
          >
            {option.name}에 투표!
          </Button>
        )}
        {isVotedFor && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', gap: 0.5 }}>
            <CheckCircleIcon fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              당신의 선택!
            </Typography>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default VoteOptionCard;