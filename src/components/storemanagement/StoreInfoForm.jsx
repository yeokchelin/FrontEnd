// src/components/storemanagement/StoreInfoForm.jsx
import React from 'react';
import { TextField, Button, Typography, Paper, MenuItem } from '@mui/material'; // MenuItem 추가 (Select용)

// 카테고리 옵션 (ChangeGradePage와 일관되게)
const CATEGORY_OPTIONS = [
  { value: '한식', label: '한식' },
  { value: '양식', label: '양식' },
  { value: '중식', label: '중식' },
  { value: '일식', label: '일식' },
  { value: '카페/디저트', label: '카페/디저트' },
  { value: '기타', label: '기타' },
];

const StoreInfoForm = ({ initialData, onUpdate, isNewStore = false }) => {
  // initialData에서 모든 필드 추출 (category, imageUrl 추가)
  const {
    storeName, address, businessHours, contactNumber, storeDescription,
    registrationNumber, category, imageUrl
  } = initialData;

  // onUpdate에서 모든 setter 함수 추출 (setCategory, setImageUrl 추가)
  const {
    setStoreName, setAddress, setBusinessHours, setContactNumber,
    setStoreDescription, /* setRegistrationNumber 제거 (아래 주석 확인) */
    setCategory, setImageUrl // ★★★ 추가된 setter 함수 ★★★
  } = onUpdate;

  const handleSubmit = (event) => {
    event.preventDefault();

    // 부모 컴포넌트의 handleSubmit (StoreManagementPage의 storeSetters.handleSubmit)에
    // 업데이트된 전체 initialData (현재 상태)를 전달합니다.
    // initialData는 부모 상태와 연동되어 있으므로 별도로 폼 데이터를 구성할 필요 없음.
    if (typeof onUpdate.handleSubmit === 'function') {
      onUpdate.handleSubmit({ // 이 객체는 ChangeGradePage에서 넘어온 initialData와 폼의 현재 상태가 결합된 형태여야 합니다.
        // 현재 StoreInfoForm은 initialData를 직접 변경하는 방식이 아니므로,
        // 여기서는 부모로부터 받은 setter들을 통해 상태를 업데이트한 후,
        // 부모의 handleSubmit을 호출할 때 업데이트된 부모 상태를 다시 넘겨주는 방식이 필요합니다.
        // 하지만 StoreInfoForm은 단순히 부모의 setter를 호출하는 역할만 하고,
        // 실제 저장 로직은 StoreManagementPage의 storeSetters.handleSubmit에서 처리하므로
        // 여기서는 필요한 필드들을 직접 전달해야 합니다.
        storeName, address, businessHours, contactNumber, storeDescription,
        registrationNumber, category, imageUrl // ★★★ 추가된 필드 전달 ★★★
      });
    } else {
      console.log('가게 정보 (부모 상태 반영):', initialData);
      alert('가게 정보가 부모로 전달되었습니다!');
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        my: { xs: 2, sm: 3 },
        maxWidth: '700px',
        ml: 'auto', mr: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        display: 'flex', flexDirection: 'column', gap: 2.5,
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        가게 정보 {isNewStore ? "등록" : "수정"}
      </Typography>

      <TextField label="상호명" value={storeName || ''} onChange={(e) => setStoreName(e.target.value)} required fullWidth variant="outlined" />
      <TextField label="주소" value={address || ''} onChange={(e) => setAddress(e.target.value)} required fullWidth variant="outlined" />

      {/* 카테고리 필드 추가 */}
      <TextField
        select // Select 컴포넌트로 만듦
        label="카테고리"
        value={category || CATEGORY_OPTIONS[0].value} // category 값 또는 기본값
        onChange={(e) => setCategory(e.target.value)}
        required
        fullWidth
        variant="outlined"
      >
        {CATEGORY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {/* 사업자 등록 번호는 수정 불가능하도록 readOnly 적용 */}
      <TextField
        label="사업자 등록 번호"
        value={registrationNumber || ''}
        fullWidth
        variant="outlined"
        InputProps={{
          readOnly: true, // ★★★ 항상 readOnly로 설정 ★★★
        }}
        helperText="사업자 등록 번호는 수정할 수 없습니다."
      />

      <TextField label="영업시간" value={businessHours || ''} onChange={(e) => setBusinessHours(e.target.value)} fullWidth multiline rows={3} variant="outlined" placeholder={"예: 월-금: 09:00 - 20:00\n토: 10:00 - 18:00\n일: 휴무"} />
      <TextField label="연락처" type="tel" value={contactNumber || ''} onChange={(e) => setContactNumber(e.target.value)} fullWidth variant="outlined" placeholder="예: 02-1234-5678" />
      <TextField label="가게 소개" value={storeDescription || ''} onChange={(e) => setStoreDescription(e.target.value)} fullWidth multiline rows={5} variant="outlined" placeholder="가게의 특징, 분위기, 주요 메뉴 등을 자유롭게 소개해주세요." />
      
      {/* 가게 대표 이미지 URL 필드 추가 */}
      <TextField label="가게 대표 이미지 URL" value={imageUrl || ''} onChange={(e) => setImageUrl(e.target.value)} fullWidth variant="outlined" placeholder="가게 사진의 URL을 입력해주세요 (선택 사항)" />

      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
        가게 정보 저장
      </Button>
    </Paper>
  );
};

export default StoreInfoForm;