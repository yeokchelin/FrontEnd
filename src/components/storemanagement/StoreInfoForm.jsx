// src/components/storemanagement/StoreInfoForm.jsx
import React from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';

const StoreInfoForm = ({ initialData, onUpdate, isNewStore = false }) => {
  const { storeName, address, businessHours, contactNumber, storeDescription, registrationNumber } = initialData;
  const { setStoreName, setAddress, setBusinessHours, setContactNumber, setStoreDescription /*, setRegistrationNumber */ } = onUpdate;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onUpdate.handleSubmit === 'function') {
      onUpdate.handleSubmit(initialData);
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

      {!isNewStore && registrationNumber && (
        <TextField
          label="사업자 등록 번호"
          value={registrationNumber || ''}
          fullWidth
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          helperText="사업자 등록 번호는 수정할 수 없습니다."
        />
      )}

      <TextField label="영업시간" value={businessHours || ''} onChange={(e) => setBusinessHours(e.target.value)} fullWidth multiline rows={3} variant="outlined" placeholder={"예: 월-금: 09:00 - 20:00\n토: 10:00 - 18:00\n일: 휴무"} />
      <TextField label="연락처" type="tel" value={contactNumber || ''} onChange={(e) => setContactNumber(e.target.value)} fullWidth variant="outlined" placeholder="예: 02-1234-5678" />
      <TextField label="가게 소개" value={storeDescription || ''} onChange={(e) => setStoreDescription(e.target.value)} fullWidth multiline rows={5} variant="outlined" placeholder="가게의 특징, 분위기, 주요 메뉴 등을 자유롭게 소개해주세요." />

      <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
        가게 정보 저장
      </Button>
    </Paper>
  );
};

export default StoreInfoForm;