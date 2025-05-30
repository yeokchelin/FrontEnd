// src/pages/board/MealMateBoardPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, CircularProgress, Alert, Button } from '@mui/material';
import MealMatePostList from '../../components/mealmateboard/MealMatePostList';
import MealMatePostForm from '../../components/mealmateboard/MealMatePostForm';
import axios from 'axios'; // axios 임포트

// API 기본 URL (vite.config.js 프록시 설정에 따라 /api로 시작)
const API_BASE_URL = '/api';

const MealMateBoardPage = () => {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // 폼 표시 여부 상태

  // 게시글 목록 불러오기 함수
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/boardmatefood/posts`);
      // 백엔드에서 받은 createdAt 기준으로 최신순 정렬
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPostList(sortedPosts);
    } catch (err) {
      console.error("게시글 목록 로딩 실패:", err);
      setError("게시글을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 게시글 목록 불러오기
  useEffect(() => {
    fetchPosts();
  }, []);

  // 새 게시글 추가 핸들러
  const handleAddPost = async (formDataFromChild) => {
    const newPostDto = {
      writer: formDataFromChild.authorName, // 프론트엔드 폼 필드명 -> 백엔드 DTO 필드명
      title: formDataFromChild.postTitle,
      content: formDataFromChild.postContent,
      meetingStation: formDataFromChild.meetingStation,
      meetingTime: formDataFromChild.meetingTime,
      recruitCount: Number(formDataFromChild.partySize), // 숫자로 변환
      preferredGender: formDataFromChild.genderPreference,
      status: "모집 중", // 기본 상태 또는 폼에서 상태를 받을 수도 있음
    };

    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/boardmatefood/write`, newPostDto);
      setShowForm(false); // 성공 시 폼 닫기
      fetchPosts(); // 목록 새로고침
      alert("게시글이 성공적으로 등록되었습니다!");
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      const errorMessage = err.response?.data?.message || "게시글 등록 중 오류가 발생했습니다.";
      setError(errorMessage);
      alert(`게시글 등록 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async (postId) => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      setIsLoading(true);
      setError(null);
      try {
        await axios.delete(`${API_BASE_URL}/boardmatefood/posts/${postId}`);
        fetchPosts(); // 삭제 후 목록 새로고침
        alert("게시글이 삭제되었습니다.");
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
        const errorMessage = err.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다.";
        setError(errorMessage);
        alert(`게시글 삭제 실패: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2.5, sm: 3 },
      }}
    >
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'medium', mb: 2 }}>
        밥친구 구하기 게시판
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2, minWidth: '200px' }}
      >
        {showForm ? '게시글 작성 취소' : '새 게시글 작성하기'}
      </Button>

      {showForm && <MealMatePostForm onAddPost={handleAddPost} />}

      <Divider sx={{ width: '100%', maxWidth: '800px', my: 2 }} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, gap: 1 }}>
          <CircularProgress size={24} />
          <Typography>로딩 중...</Typography>
        </Box>
      )}
      {error && !isLoading && ( // 로딩 중이 아닐 때만 에러 메시지 표시
        <Alert severity="error" sx={{ width: '100%', maxWidth: '800px', mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && ( // 로딩 중이 아니고 에러도 없을 때 목록 표시
        <MealMatePostList postList={postList} onDeletePost={handleDeletePost} />
      )}
    </Box>
  );
};

export default MealMateBoardPage;