// src/components/freeboard/FreePostItem.jsx
import React from 'react';
import './FreePostItem.css';

const FreePostItem = ({ postItem }) => {
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="free-post-item">
      <div className="post-header">
        <h3 className="post-title">{postItem.title}</h3>
      </div>
      <p className="post-content">{postItem.content}</p>
      <div className="post-footer">
        <span className="post-author">{postItem.authorName}</span>
        <span className="post-date">{formatDateTime(postItem.createdAt)}</span>
      </div>
    </div>
  );
};

export default FreePostItem;