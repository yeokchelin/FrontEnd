// src/pages/ChangeGradePage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, List, ListItem, ListItemText,
  Button, Divider, TextField, Alert, IconButton, Collapse
} from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ChangeGradePage() {
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [kakaoId, setKakaoId] = useState("");
  const [storeInfo, setStoreInfo] = useState({
    name: "", address: "", hours: "", contact: "",
    description: "", registrationNumber: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setKakaoId(decoded.sub); // sub에 email이나 id 저장됨
      } catch (e) {
        console.error("JWT decode 실패", e);
      }
    }
  }, []);

  useEffect(() => {
    if (kakaoId) {
      axios.get(`/api/store/user/${kakaoId}`)
        .then(res => setStores(res.data))
        .catch(err => console.error("가게 불러오기 실패", err));
    }
  }, [kakaoId]);

  const userLevel = stores.length > 0 ? "점주" : "일반";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
    if (error && ["name", "address", "registrationNumber"].includes(name)) {
      if (storeInfo.name && storeInfo.address && storeInfo.registrationNumber) {
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, address, registrationNumber } = storeInfo;
    if (!name || !address || !registrationNumber) {
      setError("상호명, 주소, 사업자 등록 번호는 필수 입력 항목입니다!");
      return;
    }

    console.log("📦 백엔드로 보낼 데이터:", {
    ...storeInfo,
    kakaoId,
  });

    try {
      const response = await axios.post("/api/store", {
        ...storeInfo,
        kakaoId
      });

      setStores(prev => [...prev, response.data]);
      setStoreInfo({
        name: "", address: "", hours: "", contact: "",
        description: "", registrationNumber: ""
      });
      setShowForm(false);

      await axios.post(`/api/users/${kakaoId}/grade`, null, {
        params: { grade: "OWNER" },
      });

      alert(userLevel === "일반" ? "점주 회원으로 전환되었습니다!" : "가게가 추가되었습니다!");
    } catch (e) {
      console.error("가게 등록 또는 등급 변경 실패", e);
      alert("등록 중 오류 발생");
    }
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm("정말로 이 가게를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/store/${id}`);
      const updated = stores.filter((store) => store.storeId !== id);
      setStores(updated);
      if (updated.length === 0) {
        alert("모든 가게가 삭제되어 일반 회원으로 전환됩니다.");
        setShowForm(true);
      }
    } catch (e) {
      console.error("가게 삭제 실패", e);
      alert("가게 삭제 중 오류 발생");
    }
  };

  return (
    <Box sx={{ width: '100%', py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        {userLevel === "점주" ? "가게 관리 및 추가 등록" : "점주 회원 신청"}
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 2, minWidth: 300 }}>
        <Typography variant="h6" textAlign="center">
          현재 회원님의 등급은{" "}
          <Typography component="span" variant="h6" fontWeight="bold" color={userLevel === "점주" ? "success.main" : "text.secondary"}>
            {userLevel}
          </Typography>{" "}입니다.
        </Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          {userLevel === "점주" ? "가게를 추가로 등록할 수 있습니다." : "가게를 등록하고 점주 혜택을 누리세요!"}
        </Typography>
      </Paper>

      <Button
        variant="contained"
        color={showForm ? "inherit" : "primary"}
        startIcon={showForm ? <CancelIcon /> : <AddBusinessIcon />}
        onClick={() => {
          setShowForm(!showForm);
          setError("");
          if (!showForm) {
            setStoreInfo({
              name: "", address: "", hours: "", contact: "",
              description: "", registrationNumber: ""
            });
          }
        }}
      >
        {showForm ? "가게 정보 입력 취소" : (userLevel === "점주" ? "다른 가게 추가 등록" : "점주 회원 신청하기")}
      </Button>

      <Collapse in={showForm} sx={{ width: "100%", maxWidth: 700 }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, borderRadius: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h6" textAlign="center">가게 정보 입력</Typography>
          <TextField name="name" label="상호명" value={storeInfo.name} onChange={handleChange} required fullWidth />
          <TextField name="address" label="주소" value={storeInfo.address} onChange={handleChange} required fullWidth />
          <TextField name="registrationNumber" label="사업자 등록 번호" value={storeInfo.registrationNumber} onChange={handleChange} required fullWidth />
          <TextField name="hours" label="영업시간 (선택)" value={storeInfo.hours} onChange={handleChange} fullWidth />
          <TextField name="contact" label="연락처 (선택)" value={storeInfo.contact} onChange={handleChange} fullWidth />
          <TextField name="description" label="가게 소개 (선택)" value={storeInfo.description} onChange={handleChange} multiline rows={3} fullWidth />
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary">등록하기</Button>
        </Paper>
      </Collapse>

      {stores.length > 0 && (
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, width: '100%', maxWidth: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StorefrontIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="h6">등록된 내 가게 목록 ({stores.length}개)</Typography>
          </Box>
          <List>
            {stores.map((store, idx) => (
              <React.Fragment key={store.storeId}>
                <ListItem
                  secondaryAction={
                    <IconButton onClick={() => handleDeleteStore(store.storeId)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1" fontWeight="medium">{store.name}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">주소: {store.address}</Typography><br />
                        {store.registrationNumber && (
                          <Typography variant="caption" color="text.disabled">
                            사업자번호: {store.registrationNumber}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {idx < stores.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
