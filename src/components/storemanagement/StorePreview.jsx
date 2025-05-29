// src/components/storemanagement/StorePreview.jsx
import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
// './StorePreview.css' 임포트는 더 이상 필요 없습니다.

// 각 정보 섹션을 렌더링하는 작은 헬퍼 컴포넌트 (코드 반복 줄이기용)
const PreviewSectionItem = ({ title, content, isMultiline = false }) => (
  <Box sx={{ mb: 2.5 }}> {/* 각 섹션 사이의 하단 마진 */}
    <Typography
      variant="subtitle1" // 섹션 제목에 적합한 크기
      component="h4"      // 시맨틱 태그
      sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }} // 제목 스타일
    >
      {title}
    </Typography>
    <Typography
      variant="body2" // 내용 텍스트
      component="p"
      sx={{
        color: 'text.secondary',                          // 약간 연한 텍스트 색상
        whiteSpace: isMultiline ? 'pre-line' : 'normal', // 여러 줄 텍스트 처리 (줄바꿈 문자 \n 인식)
        lineHeight: 1.6,                                  // 줄 간격
        wordBreak: 'break-word',                          // 긴 내용 자동 줄바꿈
      }}
    >
      {content}
    </Typography>
  </Box>
);

const StorePreview = ({ storeInfo }) => {
  // storeInfo가 없거나 내부 속성이 없을 경우를 대비하여 기본값 설정
  const {
    storeName = "가게 이름이 여기에 표시됩니다.",
    address = "주소가 여기에 표시됩니다.",
    businessHours = "영업시간이 여기에 표시됩니다.",
    contactNumber = "연락처가 여기에 표시됩니다.",
    storeDescription = "가게 소개가 여기에 표시됩니다."
  } = storeInfo || {}; // storeInfo 자체가 null/undefined일 경우 빈 객체로 처리

  return (
    <Paper
      elevation={3} // Paper에 그림자 효과
      sx={{
        p: { xs: 2, sm: 3 },          // 내부 패딩 (반응형)
        my: { xs: 2, sm: 3 },          // 상하 마진 (다른 요소와의 간격)
        width: '100%',                // 부모 컨테이너의 전체 너비 사용
        maxWidth: '700px',            // 폼과 유사한 최대 너비 설정
        ml: 'auto',                   // 좌우 마진 auto로 중앙 정렬
        mr: 'auto',
        bgcolor: 'background.paper',  // 테마의 paper 배경색
        borderRadius: 2,              // 테마 기반 모서리 둥글기
      }}
    >
      {/* 가게 이름 (헤더) */}
      <Box className="preview-header" sx={{ textAlign: 'center', mb: 2.5 }}>
        {/* 로고 이미지가 있다면 여기에 <Box component="img" ... /> 추가 가능 */}
        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {storeName}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2.5 }} /> {/* 제목과 첫 섹션 사이 구분선 */}

      {/* 각 정보 섹션 */}
      <PreviewSectionItem title="주소" content={address} />
      <PreviewSectionItem title="영업시간" content={businessHours} isMultiline={true} />
      <PreviewSectionItem title="연락처" content={contactNumber} />
      <PreviewSectionItem title="가게 소개" content={storeDescription} isMultiline={true} />

      {/* 나중에 메뉴 목록 미리보기가 추가될 경우 */}
      {/*
      <Divider sx={{ my: 2.5 }} />
      <PreviewSectionItem title="메뉴 (예정)" content="메뉴 목록 미리보기가 여기에 표시됩니다." />
      */}
    </Paper>
  );
};

export default StorePreview;