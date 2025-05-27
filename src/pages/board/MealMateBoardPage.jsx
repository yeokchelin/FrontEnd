// src/pages/board/MealMateBoardPage.jsx
import React, { useState } from 'react';
// MealMatePostList와 MealMatePostForm 임포트 경로 수정 (mealmate-board -> mealmateboard)
import MealMatePostList from '../../components/mealmateboard/MealMatePostList'; 
import MealMatePostForm from '../../components/mealmateboard/MealMatePostForm'; 
import './MealMateBoardPage.css'; // 이 페이지의 스타일 파일 (파일명 변경됨)

// 게시판 테스트를 위한 더미 데이터
const DUMMY_POST_DATA = [
  {
    id: 1,
    authorName: '밥친구123',
    title: '강남역 점심 밥친구 구해요!',
    content: '오늘 점심 12시 30분에 강남역 근처 파스타집 가려는데 밥친구 구합니다. 혼밥이 지겨우신 분 환영!',
    meetingStation: '강남역',
    meetingTime: '12:30',
    partySize: 1,
    genderPreference: '무관',
    status: '모집 중',
    createdAt: '2025-05-27T10:00:00Z',
  },
  {
    id: 2,
    authorName: '역삼혼밥러',
    title: '역삼역 저녁 같이 드실 분~',
    content: '오후 6시 30분 역삼역 근처 한식집 가실 분 구해요. 찌개류 먹을 예정이고, 대화 좋아하시는 분이면 좋겠습니다.',
    meetingStation: '역삼역',
    meetingTime: '18:30',
    partySize: 1,
    genderPreference: '여성',
    status: '모집 중',
    createdAt: '2025-05-27T09:15:00Z',
  },
  {
    id: 3,
    authorName: '테스트용',
    title: '모집 완료된 게시글 예시',
    content: '이 게시글은 모집이 완료된 상태입니다.',
    meetingStation: '선릉역',
    meetingTime: '14:00',
    partySize: 2,
    genderPreference: '남성',
    status: '모집 완료',
    createdAt: '2025-05-26T18:00:00Z',
  },
];

const MealMateBoardPage = () => { // 컴포넌트명 변경됨
  const [postList, setPostList] = useState(DUMMY_POST_DATA);

  const handleAddPost = (newPostItem) => {
    setPostList([newPostItem, ...postList]); // 최신 글이 맨 위로 오도록
  };

  return (
    <div className="mealmate-board-page-container"> {/* 클래스명 변경됨 */}
      <h2 className="page-title">밥친구 구하기</h2>

      <MealMatePostForm onAddPost={handleAddPost} /> {/* 컴포넌트명 변경됨 */}

      <hr className="divider" />

      <MealMatePostList postList={postList} /> {/* 컴포넌트명 변경됨 */}
    </div>
  );
};

export default MealMateBoardPage; // 컴포넌트명 변경됨