// src/components/mealmateboard/MealMatePostForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, MenuItem } from '@mui/material';

export default function MealMatePostForm({ onAddPost }) {
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [meetingStation, setMeetingStation] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [genderPreference, setGenderPreference] = useState('무관');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!authorName.trim() || !postTitle.trim() || !postContent.trim() || !meetingStation.trim() || !meetingTime.trim() || !partySize || partySize <= 0) {
      alert('작성자, 제목, 내용, 만날 역, 시간, 인원(1 이상)은 필수 입력 항목입니다.');
      return;
    }

    // 부모 컴포넌트로 전달할 데이터 객체
    const formData = {
      authorName,
      postTitle,
      postContent,
      meetingStation,
      meetingTime,
      partySize: Number(partySize), // 숫자로 변환
      genderPreference,
    };

    onAddPost(formData); // 부모의 handleAddPost 호출

    // 폼 초기화
    setAuthorName('');
    setPostTitle('');
    setPostContent('');
    setMeetingStation('');
    setMeetingTime('');
    setPartySize(1);
    setGenderPreference('무관');
  };

  const genderOptions = [
    { value: '무관', label: '무관' },
    { value: '남성', label: '남성만' },
    { value: '여성', label: '여성만' },
  ];

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        width: '100%', // 부모 컨테이너에 의해 너비가 조절되도록
        maxWidth: '700px', // 폼 자체의 최대 너비
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        밥친구 구하기 글쓰기
      </Typography>

      <TextField label="작성자 닉네임" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required fullWidth variant="outlined" />
      <TextField label="제목" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required fullWidth variant="outlined" />
      <TextField label="내용" value={postContent} onChange={(e) => setPostContent(e.target.value)} required fullWidth multiline rows={5} variant="outlined" />
      <TextField label="만날 역" value={meetingStation} onChange={(e) => setMeetingStation(e.target.value)} required fullWidth variant="outlined" />
      <TextField label="만날 시간" placeholder="예: 오늘 오후 7시, 내일 12:30" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required fullWidth variant="outlined" />
      <TextField
        label="구하는 인원 (본인 제외)"
        type="number"
        value={partySize}
        onChange={(e) => setPartySize(e.target.value)}
        required
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: 1 }}
      />
      <TextField
        select
        label="성별 선호"
        value={genderPreference}
        onChange={(e) => setGenderPreference(e.target.value)}
        fullWidth
        variant="outlined"
      >
        {genderOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1 }}>
        게시글 작성
      </Button>
    </Paper>
  );
};