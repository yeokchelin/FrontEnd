// src/components/mealmateboard/MealMatePostForm.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, MenuItem, Box, CircularProgress } from '@mui/material'; // CircularProgress 추가 (로딩 인디케이터용)

// currentUserId, currentUserNickname, isLoading props 추가
export default function MealMatePostForm({ onAddPost, initialFormData = null, isEditMode = false, currentUserId, currentUserNickname, isLoading }) {
  // kakaoUserId 상태 추가
  const [kakaoUserId, setKakaoUserId] = useState(null);
  const [writer, setWriter] = useState(''); // 백엔드의 'writer' 필드와 매칭

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [meetingStation, setMeetingStation] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [genderPreference, setGenderPreference] = useState('무관');
  const [status, setStatus] = useState('모집 중');

  // 컴포넌트 마운트 시 또는 props 변경 시 작성자 정보 자동 설정
  useEffect(() => {
    // 수정 모드일 때
    if (isEditMode && initialFormData) {
      setWriter(initialFormData.writer || ''); // 기존 작성자 닉네임 로드
      setKakaoUserId(initialFormData.kakaoUserId || null); // 기존 작성자 ID 로드
      setPostTitle(initialFormData.title || '');
      setPostContent(initialFormData.content || '');
      setMeetingStation(initialFormData.meetingStation || '');
      setMeetingTime(initialFormData.meetingTime || '');
      setPartySize(initialFormData.recruitCount || 1);
      setGenderPreference(initialFormData.preferredGender || '무관');
      setStatus(initialFormData.status || '모집 중');
    }
    // 새 글 작성 모드일 때
    else {
      // 현재 로그인 사용자 정보로 필드를 자동 채움
      setWriter(currentUserNickname || '');
      setKakaoUserId(currentUserId || null); // Long 타입으로 전달될 것이므로 Number() 불필요
      setPostTitle('');
      setPostContent('');
      setMeetingStation('');
      setMeetingTime('');
      setPartySize(1);
      setGenderPreference('무관');
      setStatus('모집 중'); // 새 글 작성 시 초기 상태는 '모집 중'
    }
  }, [initialFormData, isEditMode, currentUserId, currentUserNickname]); // 의존성 배열에 currentUserId, currentUserNickname 추가

  const handleSubmit = (event) => {
    event.preventDefault();

    // ★★★ 필수 필드 유효성 검사 (kakaoUserId 추가) ★★★
    if (!writer.trim() || !postTitle.trim() || !postContent.trim() ||
        !meetingStation.trim() || !meetingTime.trim() || !partySize || partySize <= 0 ||
        !kakaoUserId) { // kakaoUserId가 유효한지 확인
      alert('작성자, 제목, 내용, 만날 역, 시간, 인원(1 이상) 및 사용자 정보는 필수 입력 항목입니다.');
      return;
    }

    // 백엔드의 MatePostDto 구조에 맞춰 데이터 구성
    const formData = {
      writer: writer, // 작성자 닉네임 (DB의 writer 필드)
      title: postTitle,
      content: postContent,
      meetingStation: meetingStation,
      meetingTime: meetingTime,
      recruitCount: Number(partySize), // 백엔드 필드명 recruitCount
      preferredGender: genderPreference,
      status: status,
      kakaoUserId: kakaoUserId, // ★★★ kakaoUserId 포함 (DB의 kakao_user_id 필드) ★★★
      // writerAvatarUrl: (부모로부터 받아서 전달하거나, 나중에 처리)
    };

    // 수정 모드일 경우 postId 포함
    if (isEditMode && initialFormData && initialFormData.id) {
      formData.id = initialFormData.id;
    }

    onAddPost(formData); // 부모의 handleSavePost 호출
  };

  const genderOptions = [
    { value: '무관', label: '무관' },
    { value: '남성', label: '남성만 (게스트 기준)' },
    { value: '여성', label: '여성만 (게스트 기준)' },
  ];

  const statusOptions = [ // 상태 변경은 별도 PATCH API로 처리하는 것이 일반적이지만, 폼에서도 가능
    { value: '모집 중', label: '모집 중' },
    { value: '모집 완료', label: '모집 완료' },
  ];

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        my: { xs: 2, sm: 3 },
        width: '100%',
        maxWidth: '700px',
        mx: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        {isEditMode ? "밥친구 게시글 수정" : "밥친구 구하기 글쓰기"}
      </Typography>

      {/* 작성자 닉네임 필드 - currentNickname으로 자동 채우고 readOnly/disabled */}
      <TextField
        label="작성자 닉네임"
        value={writer}
        required
        fullWidth
        variant="outlined"
        InputProps={{
          readOnly: true, // 사용자가 직접 수정 불가
        }}
        helperText="작성자 닉네임은 로그인 정보로 자동 입력됩니다."
      />

      {/* kakaoUserId는 숨김 필드로 전송 */}
      {/* type="hidden"은 Material-UI TextField에서는 직접 지원하지 않으므로,
          Box나 input 태그를 사용하거나, 단순히 상태에만 유지하고 UI에 표시하지 않는 방식으로 처리합니다. */}
      {/* 개발자 도구에서 Network 탭을 통해 전송되는 formData에 kakaoUserId가 포함되는지 확인합니다. */}
      {/* <input type="hidden" name="kakaoUserId" value={kakaoUserId} /> */}
      {/* 또는 TextField 자체를 숨김 */}
      {/* <TextField type="hidden" value={kakaoUserId} name="kakaoUserId" /> */}


      <TextField label="제목" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required fullWidth variant="outlined" />
      <TextField label="내용" value={postContent} onChange={(e) => setPostContent(e.target.value)} required fullWidth multiline rows={5} variant="outlined" placeholder="모임에 대한 자세한 내용을 적어주세요."/>
      <TextField label="만날 역" value={meetingStation} onChange={(e) => setMeetingStation(e.target.value)} required fullWidth variant="outlined" placeholder="예: 강남역 11번 출구"/>
      <TextField label="만날 시간" placeholder="예: 오늘 오후 7시, 내일 12:30" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required fullWidth variant="outlined" />
      <TextField
        label="구하는 인원 (본인 제외)"
        type="number"
        value={partySize}
        onChange={(e) => setPartySize(e.target.value < 1 && e.target.value !== '' ? 1 : e.target.value)}
        required
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: 1 }}
      />
      <TextField
        select
        label="선호 성별 (게스트 기준)"
        value={genderPreference}
        onChange={(e) => setGenderPreference(e.target.value)}
        fullWidth
        variant="outlined"
      >
        {genderOptions.map((option) => ( <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem> ))}
      </TextField>

      {isEditMode && (
        <TextField
          label="모집 상태 (참고용)"
          value={status}
          fullWidth
          variant="outlined"
          disabled // 읽기 전용으로 표시
          sx={{mt:1}}
        />
      )}

      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, py: 1.2 }} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : (isEditMode ? "수정 완료" : "게시글 작성")}
      </Button>
    </Paper>
  );
}