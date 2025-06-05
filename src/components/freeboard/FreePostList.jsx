// src/components/freeboard/FreePostList.jsx
import React from 'react';
import { Box, Typography, List } from '@mui/material';
import FreePostItem from './FreePostItem';

const FreePostList = ({ postList, onEdit, onDelete, onPostClick }) => {
  // console.log("[FreePostList] 렌더링 시작. postList 길이:", postList.length); // 제거
  // console.log("[FreePostList] 전달받은 props: onPostClick 유무:", !!onPostClick); // 제거

  if (!Array.isArray(postList) || postList.length === 0) {
    // console.log("[FreePostList] 게시글 목록이 비어있습니다."); // 제거
    return (
      <Box sx={{ py: 6, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          아직 작성된 게시글이 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', maxWidth: '800px', mx: 'auto', py: 2 }}>
      {postList.map(postItem => {
        // console.log(`[FreePostList] 맵핑 중 - postItem ID: ${postItem.id}, 제목: ${postItem.title}`); // 제거
        return (
          <FreePostItem
            key={postItem.id}
            post={postItem} // postItem 대신 post로 prop 이름 통일 (FreePostItem에서 post로 받고 있음)
            onEdit={onEdit}
            onDelete={onDelete}
            onPostClick={onPostClick} // onPostClick prop을 FreePostItem으로 전달
          />
        );
      })}
    </List>
  );
};

export default FreePostList;