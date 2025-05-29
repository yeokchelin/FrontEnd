// src/pages/poll/PollDetailPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material'; // MUI 컴포넌트 임포트
import PollOptionCard from '../../components/poll/PollOptionCard'; // 이미 MUI Card로 수정된 컴포넌트
// import CommentSection from '../../components/poll/CommentSection'; // 나중에 추가될 댓글 섹션
import { samplePoll } from '../../components/poll/dummyPollData'; // 더미 데이터 경로 확인
// './PollDetailPage.css' 임포트는 더 이상 필요 없습니다.

const PollDetailPage = () => {
  const [pollData, setPollData] = useState(samplePoll);
  const [userVote, setUserVote] = useState(null); // 사용자가 어떤 옵션에 투표했는지 ID 저장
  const [hasVoted, setHasVoted] = useState(false); // 사용자가 투표했는지 여부

  // 투표 처리 함수
  const handleVote = (optionId) => {
    if (hasVoted) {
      alert('이미 투표하셨습니다.');
      return;
    }
    console.log(`Voted for: ${optionId}`);
    setUserVote(optionId);
    setHasVoted(true);

    // 실제 앱에서는 API 호출 후 응답에 따라 상태를 업데이트해야 합니다.
    // 여기서는 클라이언트 측에서 즉시 투표 수를 반영합니다.
    setPollData(prevData => ({
      ...prevData,
      options: prevData.options.map(opt =>
        opt.id === optionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
      ),
    }));
  };

  // 로딩 상태 처리 (pollData가 없을 경우)
  if (!pollData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)', p: 3 }}>
        <CircularProgress /> {/* MUI 로딩 스피너 */}
        <Typography sx={{ ml: 2 }}>투표 정보를 불러오는 중...</Typography>
      </Box>
    );
  }

  // 렌더링 직전에 총 투표 수 계산 (PollOptionCard에 비율 계산용으로 전달)
  const currentTotalVotes = pollData.options.reduce((sum, option) => sum + option.voteCount, 0);

  return (
    <Box
      sx={{
        width: '100%', // App.jsx의 <main> 영역 너비를 채움
        // bgcolor: 'transparent', // 기본값. App.jsx의 <main> 배경색(background.default)을 상속
        py: { xs: 2, sm: 3, md: 4 }, // 페이지 전체의 상하 패딩
        px: { xs: 1, sm: 2, md: 3 }, // 페이지 전체의 좌우 패딩
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',   // 자식 콘텐츠 블록들을 가로축 중앙 정렬
        gap: { xs: 2.5, sm: 3.5, md: 4 }, // 주요 섹션 간의 수직 간격
      }}
    >
      {/* 투표 제목 */}
      <Typography
        variant="h3" // 페이지의 메인 제목이므로 h3 또는 h4 사용
        component="h1" // 시맨틱 태그
        textAlign="center"
        gutterBottom // 하단 마진 추가
        sx={{ color: 'text.primary', fontWeight: 'bold' }}
      >
        {pollData.title}
      </Typography>

      {/* 투표 설명 */}
      <Typography
        variant="subtitle1" // 제목보다는 작은 크기
        textAlign="center"
        color="text.secondary" // 약간 연한 텍스트 색상
        paragraph // 문단으로 취급하여 적절한 마진 적용
        sx={{ maxWidth: '750px', lineHeight: 1.7 }} // 설명 텍스트의 최대 너비 및 줄 간격 조절
      >
        {pollData.description}
      </Typography>

      {/* 투표 옵션 카드들을 담는 컨테이너 */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap', // 카드들이 공간이 부족하면 다음 줄로 넘어감
          justifyContent: 'center', // 카드들을 중앙 정렬
          gap: { xs: 2, sm: 3 },       // 카드들 사이의 간격
          width: '100%',
          maxWidth: '1280px', // 옵션 카드 영역의 최대 너비 (카드 크기에 따라 조절)
        }}
      >
        {pollData.options.map(option => (
          <PollOptionCard
            key={option.id}
            option={{ ...option, totalVotes: currentTotalVotes }} // 총 투표수 정보 추가하여 전달
            onVote={handleVote}
            hasVoted={hasVoted}
            userVoteId={userVote} // 사용자가 선택한 옵션 ID 전달
          />
        ))}
      </Box>

      {/* 투표 완료 메시지 */}
      {hasVoted && (
        <Typography
          variant="h6"
          color="success.main" // 테마의 success 색상 사용 (보통 초록 계열)
          textAlign="center"
          sx={{ my: 3, fontWeight: 'medium' }}
        >
          투표해주셔서 감사합니다!
        </Typography>
      )}

      <Divider sx={{ width: '100%', maxWidth: '800px', my: 2 }} />

      {/* 댓글 섹션 플레이스홀더 */}
      <Paper
        elevation={1} // 약간의 그림자 효과
        sx={{
          p: { xs: 2, sm: 3 },
          mt: 2, // 위쪽 요소와의 간격
          width: '100%',
          maxWidth: '800px', // 댓글 섹션의 최대 너비
          bgcolor: 'background.paper', // 테마의 paper 배경색
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.primary', mb:2 }}>
          댓글 및 의견
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          여기에 댓글 기능이 들어올 예정입니다. (실제 댓글 컴포넌트로 교체 예정)
        </Typography>
        {pollData.comments && pollData.comments.length > 0 ? (
          <List disablePadding>
            {pollData.comments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {comment.author}:
                      </Typography>
                    }
                    secondary={
                      <Typography component="span" variant="body2" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, whiteSpace: 'pre-wrap' }}>
                        {comment.text}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < pollData.comments.length - 1 && <Divider component="li" variant="inset" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PollDetailPage;