// src/pages/board/FreeBoardPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import axios from 'axios';

import FreePostList from '../../components/freeboard/FreePostList';
import FreePostForm from '../../components/freeboard/FreePostForm';

const FreeBoardPage = () => {
  const [freePostList, setFreePostList] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // 수정 중인 게시글

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/freeboard");
      setFreePostList(response.data);
    } catch (error) {
      console.error("게시글 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSuccess = () => {
    setEditingPost(null);
    fetchPosts();
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2.5, sm: 3 },
      }}
    >
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
        자유 게시판
      </Typography>

      <FreePostForm
        onPostSuccess={handlePostSuccess}
        editingPost={editingPost}
        cancelEdit={() => setEditingPost(null)}
      />

      <Divider sx={{ width: '100%', maxWidth: '700px', my: 2 }} />

      <FreePostList
        postList={freePostList}
        onEdit={(post) => setEditingPost(post)}
        onDelete={handlePostSuccess}
      />
    </Box>
  );
};

export default FreeBoardPage;
