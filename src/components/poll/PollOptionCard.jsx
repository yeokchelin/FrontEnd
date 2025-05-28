// src/components/poll/VoteOptionCard.jsx
import React from 'react';
import './PollOptionCard.css'; // CSS 파일은 나중에 만듭니다.

const VoteOptionCard = ({ option, onVote, hasVoted, userVoteId }) => {
  if (!option) return null;

  const percentage = option.totalVotes > 0 ? Math.round((option.voteCount / option.totalVotes) * 100) : 0;
  const isVotedFor = hasVoted && userVoteId === option.id;

  return (
    <div className={`vote-option-card ${isVotedFor ? 'voted-for' : ''}`}>
      <img src={option.imageUrl} alt={option.name} className="option-image" />
      <h3 className="option-name">{option.name}</h3>
      <p className="option-description">{option.description}</p>
      <div className="vote-info">
        <span className="vote-count">{option.voteCount} 표</span>
        {hasVoted && <span className="vote-percentage"> ({percentage}%)</span>}
      </div>
      {!hasVoted && (
        <button onClick={() => onVote(option.id)} className="vote-button">
          {option.name}에 투표!
        </button>
      )}
      {isVotedFor && <p className="voted-message">✔ 당신의 선택!</p>}
    </div>
  );
};

export default VoteOptionCard;