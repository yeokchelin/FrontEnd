// src/components/storemanagement/StoreInfoForm.jsx
import React from 'react'; // useState는 부모에서 관리하므로 여기서는 필요 없습니다.
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
// './StoreInfoForm.css' 임포트는 더 이상 필요 없습니다.

const StoreInfoForm = ({ initialData, onUpdate }) => {
  // 부모로부터 받은 상태와 세터 함수들을 구조 분해 할당합니다.
  const { storeName, address, businessHours, contactNumber, storeDescription } = initialData;
  const { setStoreName, setAddress, setBusinessHours, setContactNumber, setStoreDescription } = onUpdate;

  const handleSubmit = (event) => {
    event.preventDefault();
    // 유효성 검사는 HTML5의 'required' 속성 및 필요시 추가 로직으로 처리할 수 있습니다.
    // 실제 데이터 업데이트는 부모 컴포넌트에서 set 함수들을 통해 이미 이루어지고 있습니다.
    // 이 함수는 주로 최종 저장 액션(예: API 호출 트리거)을 알리는 역할을 합니다.
    console.log('저장될 가게 정보 (부모 상태 반영):', initialData);
    alert('가게 정보가 저장되었습니다! (콘솔 확인 및 미리보기 반영)');
  };

  return (
    <Paper
      component="form" // Paper 컴포넌트를 HTML form 태그로 렌더링
      onSubmit={handleSubmit}
      elevation={3} // 폼에 약간의 그림자 효과
      sx={{
        p: { xs: 2, sm: 3, md: 4 }, // 반응형 내부 패딩
        my: { xs: 2, sm: 3 },       // 폼의 상하 마진 (페이지 내 다른 요소와의 간격)
        maxWidth: '700px',          // 폼의 최대 너비
        ml: 'auto',                 // 좌우 마진 auto로 중앙 정렬 (부모가 block일 경우)
        mr: 'auto',
        bgcolor: 'background.paper', // 테마의 paper 배경색 사용
        borderRadius: 2,            // 테마 기반 모서리 둥글기
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,                   // 각 입력 필드 및 버튼 사이의 간격
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        가게 정보 수정
      </Typography>

      <TextField
        label="상호명"
        id="storeName"
        value={storeName || ''} // value가 null/undefined일 경우를 대비해 '' 처리
        onChange={(e) => setStoreName(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />

      <TextField
        label="주소"
        id="address"
        value={address || ''}
        onChange={(e) => setAddress(e.target.value)}
        required
        fullWidth
        variant="outlined"
      />

      <TextField
        label="영업시간"
        id="businessHours"
        value={businessHours || ''}
        onChange={(e) => setBusinessHours(e.target.value)}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder={"예: 월-금: 09:00 - 20:00\n토: 10:00 - 18:00\n일: 휴무"} // \n으로 줄바꿈
      />

      <TextField
        label="연락처"
        id="contactNumber"
        type="tel" // 전화번호 입력에 적합한 타입
        value={contactNumber || ''}
        onChange={(e) => setContactNumber(e.target.value)}
        fullWidth
        variant="outlined"
        placeholder="예: 02-1234-5678"
      />

      <TextField
        label="가게 소개"
        id="storeDescription"
        value={storeDescription || ''}
        onChange={(e) => setStoreDescription(e.target.value)}
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        placeholder="가게의 특징, 분위기, 주요 메뉴 등을 자유롭게 소개해주세요."
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2 }} // 버튼 위쪽 마진
      >
        가게 정보 저장
      </Button>
    </Paper>
  );
};

export default StoreInfoForm;