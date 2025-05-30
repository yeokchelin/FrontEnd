// src/pages/poll/PollDetailPage.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import PollOptionCard from '../../components/poll/PollOptionCard';
import CommentSection from '../../components/comments/CommentSection'; // ❗️ CommentSection 임포트
import { samplePoll } from '../../components/poll/dummyPollData'; // 더미 투표 데이터

// './PollDetailPage.css'는 사용하지 않습니다.

const PollDetailPage = () => {
  const [pollData, setPollData] = useState(null); // ❗️ 초기값을 null로 변경 (로딩 상태 표현)
  const [userVote, setUserVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // ❗️ 임시: 현재 로그인한 사용자 정보 (실제로는 Context나 상위 상태에서 받아와야 함)
  const currentUserId = "testUser123"; // 예시 사용자 ID (CommentSection에 전달)
  const currentUserAvatarUrl = "https://via.placeholder.com/40/FFA500/FFFFFF?Text=Me"; // 예시 아바타 URL

  // pollData 로딩 시뮬레이션 (실제로는 API 호출로 대체)
  useEffect(() => {
    // 실제 API 호출 시에는 setIsLoading(true) 등으로 로딩 상태 관리
    setTimeout(() => { // API 호출 지연 시뮬레이션
      setPollData(samplePoll);
    }, 500); // 0.5초 후 더미 데이터 로드
  }, []);


  const handleVote = (optionId) => {
    if (hasVoted) {
      alert('이미 투표하셨습니다.');
      return;
    }
    console.log(`Voted for: ${optionId}`);
    setUserVote(optionId);
    setHasVoted(true);

    setPollData(prevData => ({
      ...prevData,
      options: prevData.options.map(opt =>
        opt.id === optionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
      ),
    }));
  };

  if (!pollData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)', p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>투표 정보를 불러오는 중...</Typography>
      </Box>
    );
  }

  const currentTotalVotes = pollData.options.reduce((sum, option) => sum + option.voteCount, 0);

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }, // 페이지 좌우 패딩 추가
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2.5, sm: 3.5, md: 4 },
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        textAlign="center"
        gutterBottom
        sx={{ color: 'text.primary', fontWeight: 'bold' }}
      >
        {pollData.title}
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign="center"
        color="text.secondary"
        paragraph
        sx={{ maxWidth: '750px', lineHeight: 1.7 }}
      >
        {pollData.description}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: '1280px', // 옵션 카드들이 넓게 퍼지도록
        }}
      >
        {pollData.options.map(option => (
          <PollOptionCard
            key={option.id}
            option={{ ...option, totalVotes: currentTotalVotes }}
            onVote={handleVote}
            hasVoted={hasVoted}
            userVoteId={userVote}
          />
        ))}
      </Box>

      {hasVoted && (
        <Typography
          variant="h6"
          color="success.main"
          textAlign="center"
          sx={{ my: 3, fontWeight: 'medium' }}
        >
          투표해주셔서 감사합니다!
        </Typography>
      )}

      {/* ❗️ 구분선 및 CommentSection 추가 */}
      <Divider sx={{ width: '100%', maxWidth: 'lg', my: 3 }} /> {/* 'lg'는 약 1200px */}

      <Box sx={{width: '100%', maxWidth: 'lg'}}> {/* 댓글 섹션 너비 제한 */}
        <CommentSection
          // ❗️ targetId는 현재 투표 게시물의 고유 ID여야 합니다.
          //    samplePoll에 id가 문자열로 되어있다면 그대로 사용, 숫자라면 .toString()
          targetId={pollData.id.toString()}
          currentUserId={currentUserId}
          currentUserAvatarUrl={currentUserAvatarUrl}
        />
      </Box>
      {/* 기존 댓글 플레이스홀더 Paper는 CommentSection으로 대체되었으므로 삭제 */}
    </Box>
  );
};

export default PollDetailPage;