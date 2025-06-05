// src/components/mealmateboard/MealMatePostList.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import MealMatePostItem from './MealMatePostItem';

const MealMatePostList = ({
  postList,
  onDeletePost,
  onPostClick,
  currentUserId,
  onSetStatusCompleted,
  onEditPost
}) => {
  if (!postList || postList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 4, sm: 6 }, textAlign: 'center', width: '100%' }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          아직 밥친구 게시글이 없습니다. 첫 글을 작성해보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', py: { xs: 2, sm: 3 } }}>
      {postList.map(item => (
        <MealMatePostItem
          key={item.id}
          postItem={item}
          onDelete={onDeletePost}
          onPostClick={onPostClick}
          currentUserId={currentUserId}
          onSetStatusCompleted={onSetStatusCompleted}
          onEditPost={onEditPost}
        />
      ))}
    </Box>
  );
};

export default MealMatePostList;