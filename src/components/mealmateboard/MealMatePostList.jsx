// src/components/mealmateboard/MealMatePostList.jsx
import React from 'react';
import MealMatePostItem from './MealMatePostItem'; // 방금 만든 Item 컴포넌트
import './MealMatePostList.css'; // 목록 전체 스타일

const MealMatePostList = ({ postList }) => {
  if (!postList || postList.length === 0) {
    return <p className="no-posts-message">아직 밥친구 게시글이 없습니다. 첫 글을 작성해보세요!</p>;
  }

  return (
    <div className="mealmate-post-list">
      {/* 목록 제목을 페이지 컴포넌트에서 넣어도 되고, 여기서 넣어도 됩니다. */}
      {/* <h2>밥친구 게시글 목록</h2> */}
      {postList.map(postItem => (
        <MealMatePostItem key={postItem.id} postItem={postItem} />
      ))}
    </div>
  );
};

export default MealMatePostList;