// src/components/freeboard/FreePostList.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import FreePostItem from './FreePostItem';

const FreePostList = ({ postList, onEdit, onDelete }) => {
  if (!postList || postList.length === 0) {
    return (
      <Box sx={{ py: 6, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          아직 작성된 게시글이 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', py: 2 }}>
      {postList.map(postItem => (
        <FreePostItem
          key={postItem.id}
          postItem={postItem}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

export default FreePostList;
