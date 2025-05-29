// src/components/mealmateboard/MealMatePostItem.jsx
import React from 'react';
import { Card, CardHeader, CardContent, Typography, Box, Chip } from '@mui/material';
// import { useTheme } from '@mui/material/styles'; // 테마 객체 직접 사용 시 주석 풀기 (여기서는 Chip 색상 커스텀에 예시)

// MUI 아이콘 임포트
import LocationOnIcon from '@mui/icons-material/LocationOn'; // 만날 역
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // 만날 시간
import GroupIcon from '@mui/icons-material/Group';           // 모집 인원
import WcIcon from '@mui/icons-material/Wc';               // 선호 성별 (WC: Water Closet, 남녀 아이콘 의미)

// './MealMatePostItem.css' 임포트는 더 이상 필요 없습니다.

// 날짜를 간단한 형식으로 포맷하는 함수
const formatSimpleDate = (isoString) => {
  if (!isoString) return '날짜 정보 없음';
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit', // 'long' 대신 '2-digit' 또는 'short'으로 간결하게
    day: '2-digit',
  });
};

// 세부 정보 항목을 렌더링하는 작은 헬퍼 컴포넌트 (선택 사항)
const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8, gap: 0.8 }}>
    {/* 아이콘에 기본 스타일 적용 */}
    {React.cloneElement(icon, { sx: { fontSize: '1.1rem', color: 'text.secondary' } })}
    <Typography variant="body2" component="span" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
      {label}:
    </Typography>
    <Typography variant="body2" component="span" sx={{ color: 'text.primary', wordBreak: 'break-all' }}>
      {value}
    </Typography>
  </Box>
);

const MealMatePostItem = ({ postItem }) => {
  // const theme = useTheme(); // 테마 객체 사용시 주석 풀어서 사용

  if (!postItem) {
    return null; // 데이터가 없으면 아무것도 렌더링하지 않음
  }

  // 구조 분해 할당으로 각 데이터 추출
  const {
    title = "제목 없음", // 기본값 설정
    authorName = "익명",
    meetingStation = "미정",
    meetingTime = "미정",
    content = "내용 없음",
    status = "정보 없음",
    partySize = 0,
    genderPreference = "무관",
    createdAt
  } = postItem;

  const isRecruiting = status === '모집 중';

  return (
    <Card
      elevation={2} // 카드에 약간의 그림자 효과
      sx={{
        mb: 2.5, // 각 카드 아이템 사이의 하단 마진
        bgcolor: 'background.paper', // 테마의 paper 배경색 사용
        borderRadius: 2, // 테마 기반 모서리 둥글기
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
            {title}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25, display: 'block' }}>
            {`작성자: ${authorName} | 작성일: ${formatSimpleDate(createdAt)}`}
          </Typography>
        }
        action={ // CardHeader 오른쪽에 표시될 요소 (예: 상태 표시 Chip)
          <Chip
            label={status}
            color={isRecruiting ? "success" : "default"} // '모집 중'은 success(초록 계열), 그 외는 default
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        }
        sx={{ pb: 1, alignItems: 'flex-start' }} // CardHeader 내부 패딩 및 action 정렬 조정
      />
      <CardContent sx={{ pt: 0.5 }}> {/* CardHeader와의 간격을 줄이기 위해 상단 패딩 조정 */}
        {/* 만남 정보 섹션 */}
        <Box className="meeting-info" sx={{ mb: 2, mt: 1 }}>
          <DetailItem icon={<LocationOnIcon />} label="만날 역" value={meetingStation} />
          <DetailItem icon={<AccessTimeIcon />} label="만날 시간" value={meetingTime} />
          <DetailItem icon={<GroupIcon />} label="모집 인원" value={`${partySize}명 (본인 포함 총 인원)`} />
          <DetailItem icon={<WcIcon />} label="선호 성별" value={genderPreference} />
        </Box>

        {/* 게시글 본문 내용 */}
        <Typography
          variant="body1" // 본문 내용에 적합한 크기
          component="p"
          sx={{
            color: 'text.primary',    // 내용이므로 주요 텍스트 색상 사용
            whiteSpace: 'pre-wrap', // 입력된 줄바꿈 및 공백 유지
            wordBreak: 'break-word',  // 긴 내용이 레이아웃을 깨지 않도록
            lineHeight: 1.6,          // 줄 간격
            mb: 1,                    // 하단 여백
          }}
        >
          {content}
        </Typography>
      </CardContent>
      {/* 상세 보기 버튼 등 추가 UI가 필요하다면 CardActions 컴포넌트 사용 가능 */}
      {/*
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small">상세 보기</Button>
      </CardActions>
      */}
    </Card>
  );
};

export default MealMatePostItem;