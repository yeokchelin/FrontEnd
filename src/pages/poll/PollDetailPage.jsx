// src/pages/poll/PollDetailPage.jsx
import React, { useState } from 'react'; // useEffect 임포트 제거
import PollOptionCard from '../../components/poll/PollOptionCard';
// import CommentSection from '../../components/poll/CommentSection'; // 나중에 추가
import { samplePoll } from '../../components/poll/dummyPollData';
import './PollDetailPage.css';

const PollDetailPage = () => {
  const [pollData, setPollData] = useState(samplePoll);
  const [userVote, setUserVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // 컴포넌트 상단에 있던 사용되지 않는 totalVotes 변수 제거

  const handleVote = (optionId) => {
    if (hasVoted) {
      alert('이미 투표하셨습니다.');
      return;
    }
    console.log(`Voted for: ${optionId}`);
    setUserVote(optionId);
    setHasVoted(true);

    // 클라이언트 측에서 즉시 투표 수 업데이트 (실제로는 API 응답 후 처리)
    setPollData(prevData => ({
      ...prevData,
      options: prevData.options.map(opt =>
        opt.id === optionId ? { ...opt, voteCount: opt.voteCount + 1 } : opt
      )
    }));
  };

  if (!pollData) {
    return <div>로딩 중...</div>;
  }

  // JSX 렌더링 직전에 현재 pollData를 기반으로 총 투표 수 계산
  // 이 값은 PollOptionCard에 전달되어 투표 비율 등을 계산하는 데 사용됩니다.
  const currentTotalVotes = pollData.options.reduce((sum, option) => sum + option.voteCount, 0);

  return (
    <div className="poll-detail-page">
      <h1 className="poll-title">{pollData.title}</h1>
      <p className="poll-description">{pollData.description}</p>

      <div className="options-container">
        {pollData.options.map(option => (
          <PollOptionCard
            key={option.id}
            option={{ ...option, totalVotes: currentTotalVotes }} // 계산된 총 투표수 전달
            onVote={handleVote}
            hasVoted={hasVoted}
            userVoteId={userVote}
          />
        ))}
      </div>

      {hasVoted && <p className="thank-you-message">투표해주셔서 감사합니다!</p>}

      <div className="comment-section-placeholder">
        <h2>댓글 및 의견</h2>
        <p>여기에 댓글 기능이 들어올 예정입니다.</p>
        <ul>
          {pollData.comments.map(comment => (
            <li key={comment.id}><strong>{comment.author}:</strong> {comment.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PollDetailPage;