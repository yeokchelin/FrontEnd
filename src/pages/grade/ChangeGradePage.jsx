// src/pages/ChangeGradePage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, List, ListItem, ListItemText,
  Button, Divider, TextField, Alert, IconButton, Collapse,
  useTheme // ❗️ useTheme 훅 임포트 추가!
} from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function ChangeGradePage() {
  const theme = useTheme(); // ❗️ 현재 테마 객체 가져오기
  const [stores, setStores] = useState([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [storeInfo, setStoreInfo] = useState({
    name: "", address: "", hours: "", contact: "",
    description: "", registrationNumber: ""
  });

  // 1. 마운트 시 localStorage에서 가게 정보 불러오기
  useEffect(() => {
    let loadedStores = [];
    try {
      const savedStoresData = localStorage.getItem('userRegisteredStores');
      if (savedStoresData) {
        const parsedStores = JSON.parse(savedStoresData);
        if (Array.isArray(parsedStores)) {
          loadedStores = parsedStores;
        }
      }
    } catch (e) {
      console.error("ChangeGradePage: 로컬 스토리지 로딩/파싱 실패", e);
    }
    setStores(loadedStores);
    setIsInitialLoadComplete(true);
  }, []);

  // 2. stores 상태가 '변경'될 때만 localStorage에 저장 (초기 로딩 완료 후)
  useEffect(() => {
    if (isInitialLoadComplete) {
      try {
        localStorage.setItem('userRegisteredStores', JSON.stringify(stores));
      } catch (e) {
        console.error("ChangeGradePage: 로컬 스토리지 저장 실패", e);
      }
    }
  }, [stores, isInitialLoadComplete]);

  const userLevel = stores.length > 0 ? "점주" : "일반";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({ ...prev, [name]: value }));
    if (error && (name === "name" || name === "address" || name === "registrationNumber")) {
      if (storeInfo.name.trim() && storeInfo.address.trim() && storeInfo.registrationNumber.trim()) {
        setError("");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, address, registrationNumber } = storeInfo;
    if (!name.trim() || !address.trim() || !registrationNumber.trim()) {
      setError("상호명, 주소, 사업자 등록 번호는 필수 입력 항목입니다! 😿");
      return;
    }
    setError("");
    const newStore = { ...storeInfo, id: Date.now() };
    setStores((prevStores) => [...prevStores, newStore]);
    alert(stores.length === 0 ? "가게 등록 완료! 🎉 이제 점주 회원이 되셨습니다!" : "새로운 가게가 추가되었습니다! 🎉");
    setStoreInfo({ name: "", address: "", hours: "", contact: "", description: "", registrationNumber: "" });
    setShowForm(false);
  };

  const handleDeleteStore = (storeId) => {
    if (window.confirm("정말로 이 가게를 폐업 처리하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      const updatedStores = stores.filter((store) => store.id !== storeId);
      setStores(updatedStores);
      if (updatedStores.length === 0) {
        alert("모든 가게가 삭제되어 일반 회원으로 변경됩니다! 😿");
        setShowForm(true);
      } else {
        alert("가게가 폐업 처리되었습니다. 🏚️");
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
        gap: { xs: 2.5, sm: 3.5 },
      }}
    >
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'bold', mb:1 }}>
        {userLevel === "점주" ? "가게 관리 및 추가 등록" : "점주 회원 신청"}
      </Typography>

      <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2, width: 'fit-content', minWidth: '280px' }}>
        <Typography variant="h6" component="h2" sx={{ color: 'text.secondary' }}> {/* ❗️이 부분의 text.secondary가 문제일 수 있음 */}
          현재 회원님의 등급은 <Typography component="span" variant="h6"
            sx={{
              fontWeight:'bold',
              // ❗️ userLevel 텍스트 색상을 다크 모드에 맞게 명시적으로 설정
              color: userLevel === "점주" ? 'success.main' : (theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary')
            }}
          >
            {userLevel}
          </Typography> 입니다.
        </Typography>
        {userLevel === "일반" && !showForm &&
            <Typography variant="body2" color="text.disabled" sx={{mt:0.5}}>
              가게를 등록하고 점주 혜택을 누려보세요!
            </Typography>
        }
        {userLevel === "점주" && !showForm &&
            <Typography variant="body2" color="text.disabled" sx={{mt:0.5}}>
              새로운 가게를 추가로 등록하거나 기존 가게를 관리할 수 있습니다.
            </Typography>
        }
      </Paper>

      {/* ... (이하 Button, Collapse, Paper form, 가게 목록 등 나머지 JSX는 이전 답변과 동일하게 유지) ... */}
      <Button
        variant="contained"
        onClick={() => {
            setShowForm(!showForm);
            if (showForm) setError("");
            if (!showForm) {
                setStoreInfo({
                    name: "", address: "", hours: "", contact: "",
                    description: "", registrationNumber: ""
                });
            }
        }}
        startIcon={showForm ? <CancelIcon /> : <AddBusinessIcon />}
        color={showForm ? "inherit" : "primary"}
        size="large"
        sx={{ minWidth: '240px', py: 1.2, my:1 }}
      >
        {showForm ? "가게 정보 입력 취소" : (userLevel === "점주" ? "다른 가게 추가 등록" : "점주 회원 신청하기")}
      </Button>

      <Collapse in={showForm} timeout="auto" sx={{width: '100%', maxWidth: '700px'}}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h3" align="center" sx={{mb:1, color:'text.primary'}}>
            {userLevel === "점주" && stores.length > 0 ? "추가할 가게 정보 입력" : "가게 정보 입력"}
          </Typography>

          <TextField name="name" label="상호명" value={storeInfo.name} onChange={handleChange} fullWidth required helperText="*필수 입력 항목입니다." />
          <TextField name="address" label="주소" value={storeInfo.address} onChange={handleChange} fullWidth required helperText="*필수 입력 항목입니다." />
          <TextField name="registrationNumber" label="사업자 등록 번호" value={storeInfo.registrationNumber} onChange={handleChange} fullWidth required helperText="*필수 입력 항목입니다." />
          <TextField name="hours" label="영업시간 (선택)" value={storeInfo.hours} onChange={handleChange} fullWidth multiline rows={2} />
          <TextField name="contact" label="연락처 (선택)" type="tel" value={storeInfo.contact} onChange={handleChange} fullWidth />
          <TextField name="description" label="가게 소개 (선택 사항)" value={storeInfo.description} onChange={handleChange} fullWidth multiline rows={3}/>

          {error && (
            <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError("")}>{error}</Alert>
          )}

          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1.5, py: 1.2 }}>
            {userLevel === "점주" && stores.length > 0 ? "추가 가게 등록하기" : "점주 회원 신청 및 가게 등록"}
          </Button>
        </Paper>
      </Collapse>

      {stores.length > 0 && (
        <Paper elevation={2} sx={{ p: {xs: 2, sm: 3}, mt: 3, width: '100%', maxWidth: '700px', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StorefrontIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.75rem' }} />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                현재 등록된 내 가게 목록 ({stores.length}개)
            </Typography>
          </Box>
          <List disablePadding>
            {stores.map((store, index) => (
              <React.Fragment key={store.id}>
                <ListItem
                  sx={{px:0, py: 1.5}}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete store" onClick={() => handleDeleteStore(store.id)} title="가게 폐업 처리">
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1" component="strong" sx={{fontWeight:'medium'}}>{store.name}</Typography>}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary" display="block">주소: {store.address}</Typography>
                        {store.registrationNumber && <Typography component="span" variant="caption" color="text.disabled">사업자번호: {store.registrationNumber}</Typography>}
                      </>
                    }
                  />
                </ListItem>
                {index < stores.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}