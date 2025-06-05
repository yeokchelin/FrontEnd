// src/components/mealmateboard/MealMatePostForm.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, MenuItem, Box } from '@mui/material'; // Box 추가 (선택적 레이아웃용)

export default function MealMatePostForm({ onAddPost, initialFormData = null, isEditMode = false }) {
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [meetingStation, setMeetingStation] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [genderPreference, setGenderPreference] = useState('무관');
  const [status, setStatus] = useState('모집 중');


  useEffect(() => {
    if (isEditMode && initialFormData) {
      setAuthorName(initialFormData.writer || ''); // 백엔드 필드명 writer 매칭
      setPostTitle(initialFormData.title || '');
      setPostContent(initialFormData.content || '');
      setMeetingStation(initialFormData.meetingStation || '');
      setMeetingTime(initialFormData.meetingTime || '');
      setPartySize(initialFormData.recruitCount || 1); // 백엔드 필드명 recruitCount 매칭
      setGenderPreference(initialFormData.preferredGender || '무관');
      setStatus(initialFormData.status || '모집 중');
    } else {
      // 새 글 작성 모드 시, authorName은 현재 로그인 사용자 정보로 채우는 것이 좋음
      // 여기서는 일단 비워두거나, 부모로부터 currentUserNickname 등을 받아와서 설정 가능
      setAuthorName(''); // 예: props.currentUserNickname || ''
      setPostTitle('');
      setPostContent('');
      setMeetingStation('');
      setMeetingTime('');
      setPartySize(1);
      setGenderPreference('무관');
      setStatus('모집 중');
    }
  }, [initialFormData, isEditMode]); // 의존성 배열에 isEditMode도 포함

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!authorName.trim() || !postTitle.trim() || !postContent.trim() || !meetingStation.trim() || !meetingTime.trim() || !partySize || partySize <= 0) {
      alert('작성자, 제목, 내용, 만날 역, 시간, 인원(1 이상)은 필수 입력 항목입니다.');
      return;
    }

    const formData = {
      authorName,
      postTitle,
      postContent,
      meetingStation,
      meetingTime,
      partySize: Number(partySize),
      genderPreference,
      status,
    };
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

  const statusOptions = [
    { value: '모집 중', label: '모집 중' },
    { value: '모집 완료', label: '모집 완료' },
  ];


  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{ // ❗️ 여기에 실제 스타일 객체 적용
        p: { xs: 2, sm: 3, md: 4 },        // 내부 패딩
        my: { xs: 2, sm: 3 },            // 폼 자체의 상하 마진
        width: '100%',                   // 부모 컨테이너 너비에 맞춤
        maxWidth: '700px',               // 폼의 최대 너비
        mx: 'auto',                      // 폼을 감싸는 부모가 중앙 정렬을 이미 하고 있다면 생략 가능
        bgcolor: 'background.paper',     // 테마의 paper 배경색
        borderRadius: 2,                 // 테마 기반 모서리 둥글기
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,                        // 각 폼 요소들 사이의 간격
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        {isEditMode ? "밥친구 게시글 수정" : "밥친구 구하기 글쓰기"}
      </Typography>

      {/* 작성자는 수정 모드에서는 보통 변경하지 않거나, 현재 로그인 사용자로 고정 */}
      <TextField
        label="작성자 닉네임"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
        fullWidth
        variant="outlined"
        // ❗️ isEditMode일 때 disabled로 설정하거나,
        //    새 글 작성 시에는 현재 로그인 사용자 닉네임을 받아와서 readOnly 또는 disabled로 설정 권장
        disabled={isEditMode} // 예시: 수정 시 작성자 변경 불가
        helperText={isEditMode ? "작성자는 변경할 수 없습니다." : "표시될 닉네임입니다."}
      />
      <TextField label="제목" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required fullWidth variant="outlined" />
      <TextField label="내용" value={postContent} onChange={(e) => setPostContent(e.target.value)} required fullWidth multiline rows={5} variant="outlined" placeholder="모임에 대한 자세한 내용을 적어주세요."/>
      <TextField label="만날 역" value={meetingStation} onChange={(e) => setMeetingStation(e.target.value)} required fullWidth variant="outlined" placeholder="예: 강남역 11번 출구"/>
      <TextField label="만날 시간" placeholder="예: 오늘 오후 7시, 내일 12:30" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required fullWidth variant="outlined" />
      <TextField
        label="구하는 인원 (본인 제외)"
        type="number"
        value={partySize}
        onChange={(e) => setPartySize(e.target.value < 1 && e.target.value !== '' ? 1 : e.target.value)} // 1 미만 입력 방지 (부분적)
        required
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: 1 }} // HTML5 기본 유효성 검사
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

      {/*
        수정 모드일 때만 상태(status) 필드를 보여줄 수 있습니다.
        하지만 "모집 완료" 버튼이 별도로 있으므로, 이 폼에서 직접 상태를 변경하는 것은 UX상 혼란을 줄 수 있습니다.
        만약 관리자 기능 등으로 상태를 직접 변경해야 한다면 이 필드를 활성화할 수 있습니다.
        현재는 주석 처리하거나, 읽기 전용으로 표시하는 것을 고려합니다.
      */}
      {isEditMode && (
        <TextField
          label="모집 상태 (참고용)"
          value={status}
          fullWidth
          variant="outlined"
          disabled // 읽기 전용으로 표시
          sx={{mt:1}}
          // helperText="모집 상태는 '모집 완료' 버튼으로 변경해주세요."
        />
      )}

      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, py: 1.2 }}>
        {isEditMode ? "수정 완료" : "게시글 작성"}
      </Button>
    </Paper>
  );
};