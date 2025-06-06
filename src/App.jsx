// src/App.jsx
import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Box,
  IconButton,
  ThemeProvider,
  CssBaseline,
  useTheme,
  Modal,
  Paper,
  Typography,
  Alert, CircularProgress,
  List, ListItemButton, ListItemText, Divider
} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from "jwt-decode";

import getAppTheme from "./theme/muiTheme.js";

import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";

import MyPage from "./pages/mypage/MyPage";
import FreeBoardPage from "./pages/board/FreeBoardPage";
import MealMateBoardPage from "./pages/board/MealMateBoardPage";
import StoreManagementPage from "./pages/storemanagement/StoreManagementPage";
import ChangeGradePage from "./pages/grade/ChangeGradePage";
import KakaoTokenHandler from "./pages/auth/KakaoTokenHandler";
import StoreDetailPage from "./pages/storedetail/StoreDetailPage.jsx"; // 경로 확인
import ReviewPage from "./pages/review/ReviewPage"; // ✨ ReviewPage 임포트 추가
import TodayMenuPage from "./pages/todaymenu/TodayMenuPage.jsx";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppContent() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [view, setView] = useState("map");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurantForReview, setSelectedRestaurantForReview] = useState(null); // ReviewPage로 넘겨줄 restaurant 객체

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserNickname, setCurrentUserNickname] = useState(null);
  const [currentUserAvatarUrl, setCurrentUserAvatarUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [openStationInfoModal, setOpenStationInfoModal] = useState(false);

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const loadUserInfoFromLocalStorage = useCallback(() => {
    const token = localStorage.getItem("jwt");
    const storedUserId = localStorage.getItem("currentUserId");
    const storedNickname = localStorage.getItem("currentUserNickname");
    const storedAvatarUrl = localStorage.getItem("currentUserAvatarUrl");

    if (token && storedUserId && storedNickname) {
      try {
        const decodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);

        if (decodedToken.exp > now) {
          const numericUserId = Number(storedUserId);

          if (!isNaN(numericUserId)) {
            setCurrentUserId(numericUserId);
            setCurrentUserNickname(storedNickname);
            setCurrentUserAvatarUrl(storedAvatarUrl || decodedToken.profileImage || "https://via.placeholder.com/40/CCCCCC/FFFFFF?Text=U");
            setIsLoggedIn(true);
          } else {
            clearUserInfo();
          }
        } else {
          clearUserInfo();
        }
      } catch (error) {
        clearUserInfo();
      }
    } else {
      clearUserInfo();
    }
  }, []);

  const clearUserInfo = useCallback(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserNickname");
    localStorage.removeItem("currentUserAvatarUrl");
    setCurrentUserId(null);
    setCurrentUserNickname(null);
    setCurrentUserAvatarUrl(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    loadUserInfoFromLocalStorage();

    const handleStorageChange = (event) => {
      if (event.key === 'jwt' || event.key === 'currentUserId' || event.key === 'currentUserNickname') {
        loadUserInfoFromLocalStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUserInfoFromLocalStorage]);


  const handleRestaurantSelect = useCallback((restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenStationInfoModal(false);
    setView("storeDetail");
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setView("map");
    setSelectedRestaurant(null);
    setSelectedRestaurantForReview(null); // 상세에서 맵으로 돌아갈 때 리뷰 관련 정보 초기화
  }, []);

  const handleViewRestaurantReviews = useCallback((restaurant) => {
    setSelectedRestaurantForReview(restaurant); // StoreDetailPage에서 넘겨받은 restaurant 객체를 저장
    setView("review"); // 뷰를 "review"로 설정
  }, []);

  const handleBackFromReview = useCallback(() => {
    // 리뷰 페이지에서 상세 페이지로 돌아갈 때, StoreDetailPage가 다시 보여야 하므로 view를 "storeDetail"로 설정
    setView("storeDetail");
    // setSelectedRestaurantForReview는 StoreDetailPage를 렌더링할 때 필요 없지만,
    // StoreDetailPage로 돌아가도 restaurantId는 남아있으므로 그대로 둠.
    // 필요에 따라 setSelectedRestaurantForReview(null);을 추가할 수 있습니다.
  }, []);

  useEffect(() => {
    if (view === 'map') {
      setSelectedRestaurant(null);
      setSelectedRestaurantForReview(null);
    }
  }, [selectedStation, view]);

  const handleMapStationSelect = useCallback((stationObject) => {
    setSelectedStation(stationObject);
    setOpenStationInfoModal(true);
    setSelectedRestaurant(null);
  }, []);

  const handleCloseStationInfoModal = useCallback(() => {
    setOpenStationInfoModal(false);
    setSelectedStation(null);
  }, []);

  return (
    <Routes>
      <Route path="/kakao/token" element={<KakaoTokenHandler onLoginSuccess={loadUserInfoFromLocalStorage} />} />

      <Route path="*" element={(
        <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", bgcolor: 'background.default' }}>
          <Sidebar
            setView={setView}
            isLoggedIn={isLoggedIn}
            clearUserInfo={clearUserInfo}
          />
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Box
              component="header"
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                p: 1.5, bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}`, minHeight: '64px',
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Header
                  onSearchSelect={(station) => {
                    setSelectedStation(station);
                    setOpenStationInfoModal(true);
                    setView("map");
                  }}
                  onCategoryChange={(category) => setSelectedCategory(category)}
                  selectedCategory={selectedCategory}
                />
              </Box>
              <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit" aria-label={theme.palette.mode === 'dark' ? "라이트 모드" : "다크 모드"}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>

            <Box
              component="main"
              sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: { xs: 1.5, sm: 2, md: 3 },
              }}
            >
              {view === "mypage" ? ( <MyPage setView={setView} /> )
                : view === "todayMenu" ? ( <TodayMenuPage /> )
                : view === "free" ? ( <FreeBoardPage
                    currentUserId={currentUserId}
                    currentUserNickname={currentUserNickname}
                    currentUserAvatarUrl={currentUserAvatarUrl}
                  /> )
                : view === "mate" ? ( <MealMateBoardPage
                    currentUserId={currentUserId}
                    currentUserNickname={currentUserNickname}
                    currentUserAvatarUrl={currentUserAvatarUrl}
                  /> )
                // ✨ 이 부분이 변경되었습니다! "리뷰 페이지 (구현 예정)" 텍스트 대신 ReviewPage 컴포넌트를 렌더링합니다.
                : view === "review" && selectedRestaurantForReview ? (
                    <ReviewPage
                      restaurant={selectedRestaurantForReview} // StoreDetailPage에서 전달받은 restaurant 객체
                      onBack={handleBackFromReview} // ReviewPage에서 StoreDetailPage로 돌아갈 함수
                      // ReviewPage에서 사용자 정보가 필요하다면 아래 prop들도 전달합니다.
                      currentUserId={currentUserId}
                      currentUserNickname={currentUserNickname}
                      currentUserAvatarUrl={currentUserAvatarUrl}
                      isLoggedIn={isLoggedIn}
                    />
                  )
                : view === "manageStore" ? ( <StoreManagementPage /> )
                : view === "changeGrade" ? ( <ChangeGradePage
                      currentUserId={currentUserId}
                    /> )
                : view === "storeDetail" && selectedRestaurant ? (
                    <StoreDetailPage
                      restaurantId={selectedRestaurant.id}
                      onBack={handleBackFromDetail}
                      onViewReviews={handleViewRestaurantReviews}
                      currentUserId={currentUserId}
                      currentUserNickname={currentUserNickname}
                      currentUserAvatarUrl={currentUserAvatarUrl}
                    />
                  ) : ( // view === "map" 이거나 기본 뷰일 때
                    <>
                      <Paper elevation={3} sx={{
                        width: '90%',
                        maxWidth: '1200px',
                        height: '700px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'auto',
                        mb: 4,
                        borderRadius: 2,
                      }}>
                        <MetroMap selected={selectedStation} onSelect={handleMapStationSelect} />
                      </Paper>

                      <Modal
                        open={openStationInfoModal}
                        onClose={handleCloseStationInfoModal}
                        aria-labelledby="station-info-modal-title"
                        aria-describedby="station-info-modal-description"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Paper sx={{
                          position: 'relative',
                          width: { xs: '95%', sm: '80%', md: '600px' },
                          maxHeight: '90vh',
                          overflowY: 'auto',
                          p: { xs: 2, sm: 3, md: 4 },
                          borderRadius: 2,
                          outline: 'none',
                        }}>
                          {selectedStation && (
                            <StationInfo
                              stationName={selectedStation.name}
                              onRestaurantSelect={handleRestaurantSelect}
                              onClose={handleCloseStationInfoModal}
                            />
                          )}
                        </Paper>
                      </Modal>
                    </>
                  )}
            </Box>
          </Box>
        </Box>
      )} />
    </Routes>
  );
}

export default function App() {
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
  }), []);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}