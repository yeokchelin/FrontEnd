// src/components/freeboard/FreePostList.jsx
import React from 'react';
import FreePostItem from './FreePostItem';
import './FreePostList.css';

const FreePostList = ({ postList }) => {
  if (!postList || postList.length === 0) {
    return <p className="no-posts">아직 작성된 게시글이 없습니다.</p>;
  }

  return (
    <div className="free-post-list">
      {postList.map(postItem => (
        <FreePostItem key={postItem.id} postItem={postItem} />
      ))}
    </div>
  );
};

export default FreePostList;