// src/pages/grade/ChangeGradePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Paper, List, ListItem, ListItemText,
  Button, Divider, TextField, Alert, IconButton, Collapse,
  MenuItem // Select 사용을 위해 MenuItem 임포트
  // Modal 임포트 제거됨
} from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import MetroMap from "../../components/main/MetroMap"; // ★★★ MetroMap 임포트 제거 ★★★
// import CloseIcon from '@mui/icons-material/Close'; // ★★★ CloseIcon 임포트 제거 ★★★

// ★★★ 2호선 역 데이터 임포트 ★★★
import { mainLineStations, seongsuBranch, sinjeongBranch } from "../../data/stationLine2";

// 카테고리 옵션
const CATEGORY_OPTIONS = [
  { value: '한식', label: '한식' },
  { value: '양식', label: '양식' },
  { value: '중식', label: '중식' },
  { value: '일식', label: '일식' },
  { value: '카페/디저트', label: '카페/디저트' },
  { value: '기타', label: '기타' },
];

// ★★★ 모든 2호선 역 이름 목록 생성 (컴포넌트 외부에 정의) ★★★
const ALL_LINE2_STATIONS = [
  ...mainLineStations,
  ...seongsuBranch.slice(1),
  ...sinjeongBranch.slice(1)
].map(station => station.name);

// 중복 제거 및 정렬
const UNIQUE_SORTED_LINE2_STATIONS = [...new Set(ALL_LINE2_STATIONS)].sort();


export default function ChangeGradePage() {
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [kakaoId, setKakaoId] = useState("");

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    address: "",
    hours: "",
    contact: "",
    description: "",
    registrationNumber: "",
    category: "한식",
    imageUrl: "",
    meetingStation: "", // 만날 역 필드
  });

  // ★★★ MetroMap 모달 관련 상태 제거 ★★★
  // const [openMetroMapModal, setOpenMetroMapModal] = useState(false);
  // const [selectedStationInMap, setSelectedStationInMap] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.sub;
        setKakaoId(userId);

        const savedLocalStoresData = localStorage.getItem('userRegisteredStores');
        if (savedLocalStoresData) {
          try {
            const parsedStores = JSON.parse(savedStoresData);
            if (Array.isArray(parsedStores)) {
              setStores(parsedStores.map(store => ({
                ...store,
                category: store.category || "한식",
                imageUrl: store.imageUrl || "",
                meetingStation: store.meetingStation || "",
              })));
            }
          } catch (e) {
            console.error("로컬 스토리지 'userRegisteredStores' 파싱 실패", e);
            localStorage.removeItem('userRegisteredStores');
          }
        }
      } catch (e) {
        console.error("JWT decode 실패", e);
      }
    }
  }, []);

  useEffect(() => {
    if (kakaoId) {
      axios.get(`/api/store/user/${kakaoId}`)
        .then(res => {
          const fetchedStores = res.data;
          setStores(fetchedStores.map(store => ({
            ...store,
            category: store.category || "한식",
            imageUrl: store.imageUrl || "",
            meetingStation: store.meetingStation || "",
          })));
          localStorage.setItem('userRegisteredStores', JSON.stringify(fetchedStores));
        })
        .catch(err => console.error("가게 불러오기 실패", err));
    }
  }, [kakaoId]);


  const userLevel = stores.length > 0 ? "점주" : "일반";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
    if (error && ["name", "address", "registrationNumber", "category", "meetingStation"].includes(name)) {
      if (storeInfo.name && storeInfo.address && storeInfo.registrationNumber && storeInfo.category && storeInfo.meetingStation) {
        setError("");
      }
    }
  };

  // ★★★ MetroMap 관련 핸들러 제거 (handleStationSelect, handleOpenMetroMapModal, handleCloseMetroMapModal) ★★★
  // 역 선택은 이제 드롭다운의 onChange (handleChange)를 통해 직접 처리됩니다.

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, address, registrationNumber, category, meetingStation } = storeInfo;
    if (!name || !address || !registrationNumber || !category || !meetingStation) {
      setError("상호명, 주소, 사업자 등록 번호, 카테고리, 만날 역은 필수 입력 항목입니다!");
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

      const newRegisteredStore = response.data;

      let currentRegisteredStores = JSON.parse(localStorage.getItem('userRegisteredStores')) || [];
      if (!Array.isArray(currentRegisteredStores)) {
        currentRegisteredStores = [];
      }
      currentRegisteredStores.push(newRegisteredStore);

      localStorage.setItem('userRegisteredStores', JSON.stringify(currentRegisteredStores));

      setStores(prev => [...prev, newRegisteredStore]);
      setStoreInfo({
        name: "", address: "", hours: "", contact: "",
        description: "", registrationNumber: "",
        category: "한식",
        imageUrl: "",
        meetingStation: "",
      });
      setShowForm(false);
      setError("");

      await axios.post(`/api/users/${Number(kakaoId)}/grade`, null, {
        params: { grade: "OWNER" },
      });

      alert(userLevel === "일반" ? "점주 회원으로 전환되었습니다!" : "가게가 추가되었습니다!");

    } catch (e) {
      console.error("가게 등록 또는 등급 변경 실패", e.response?.data || e.message || e);
      setError(e.response?.data?.message || e.message || "가게 등록 중 오류 발생");
      alert("등록 중 오류 발생: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
    }
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm("정말로 이 가게를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/store/${id}`);

      const updatedStores = stores.filter((store) => store.storeId !== id);
      setStores(updatedStores);

      localStorage.setItem('userRegisteredStores', JSON.stringify(updatedStores));

      if (updatedStores.length === 0) {
        alert("모든 가게가 삭제되어 일반 회원으로 전환됩니다.");
        setShowForm(true);
        await axios.post(`/api/users/${Number(kakaoId)}/grade`, null, {
          params: { grade: "NORMAL" },
        }).catch(err => console.error("등급 변경 실패:", err));
      } else {
        alert("가게가 성공적으로 삭제되었습니다.");
      }
    } catch (e) {
      console.error("가게 삭제 실패", e.response?.data || e.message || e);
      alert("가게 삭제 중 오류 발생: " + (e.response?.data?.message || e.message || "알 수 없는 오류"));
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
              description: "", registrationNumber: "",
              category: "한식",
              imageUrl: "",
              meetingStation: "",
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
          <TextField
            name="category"
            label="카테고리"
            value={storeInfo.category}
            onChange={handleChange}
            required
            fullWidth
            select
          >
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField name="registrationNumber" label="사업자 등록 번호" value={storeInfo.registrationNumber} onChange={handleChange} required fullWidth />
          <TextField name="hours" label="영업시간 (선택)" value={storeInfo.hours} onChange={handleChange} fullWidth />
          <TextField name="contact" label="연락처 (선택)" value={storeInfo.contact} onChange={handleChange} fullWidth />
          <TextField name="imageUrl" label="가게 대표 이미지 URL (선택)" value={storeInfo.imageUrl} onChange={handleChange} fullWidth />
          <TextField name="description" label="가게 소개 (선택)" value={storeInfo.description} onChange={handleChange} multiline rows={3} fullWidth />
          
          {/* ★★★ 만날 역 TextField (Select 드롭다운만 사용) ★★★ */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'text.secondary', fontWeight: 'medium' }}>
            만날 역 선택 (2호선)
          </Typography>
          <TextField
            name="meetingStation"
            label="목록에서 선택"
            value={storeInfo.meetingStation}
            onChange={handleChange}
            required
            fullWidth
            select
          >
            <MenuItem value="">-- 역 선택 --</MenuItem>
            {UNIQUE_SORTED_LINE2_STATIONS.map((stationName) => (
              <MenuItem key={stationName} value={stationName}>
                {stationName}
              </MenuItem>
            ))}
          </TextField>

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
              <React.Fragment key={store.storeId || `store-${idx}`}>
                <ListItem
                  secondaryAction={
                    <IconButton onClick={() => {
                      console.log("삭제할 store id:", store.storeId, store);
                      handleDeleteStore(store.storeId)
                      }}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1" fontWeight="medium" component="span">{store.name}</Typography>}
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.secondary" component="span">주소: {store.address}</Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary" component="span">카테고리: {store.category || 'N/A'}</Typography>
                        {store.registrationNumber && (
                          <React.Fragment>
                            <br />
                            <Typography variant="caption" color="text.disabled" component="span">
                              사업자번호: {store.registrationNumber}
                            </Typography>
                          </React.Fragment>
                        )}
                        {store.imageUrl && (
                          <React.Fragment>
                            <br />
                            <Typography variant="caption" color="text.disabled" component="span">
                              이미지 URL: {store.imageUrl}
                            </Typography>
                          </React.Fragment>
                        )}
                        {store.meetingStation && ( // meetingStation 표시
                          <React.Fragment>
                            <br />
                            <Typography variant="caption" color="text.disabled" component="span">
                              만날 역: {store.meetingStation}
                            </Typography>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {idx < stores.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* ★★★ MetroMap 모달 관련 코드 완전히 제거됨 ★★★ */}
    </Box>
  );
}