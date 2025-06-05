// src/App.jsx
import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Box,
  IconButton,
  ThemeProvider,
  CssBaseline,
  useTheme
} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { jwtDecode } from "jwt-decode";

import getAppTheme from "./theme/muiTheme.js";

import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";
import MyPage from "./pages/mypage/MyPage";
import PollDetailPage from "./pages/poll/PollDetailPage";
import FreeBoardPage from "./pages/board/FreeBoardPage";
import MealMateBoardPage from "./pages/board/MealMateBoardPage";
import StoreManagementPage from "./pages/storemanagement/StoreManagementPage";
import ChangeGradePage from "./pages/grade/ChangeGradePage";
import KakaoTokenHandler from "./pages/auth/KakaoTokenHandler";
import StoreDetailPage from "./pages/storedetail/StoreDetailPage.jsx";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppContent() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [view, setView] = useState("map");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurantForReview, setSelectedRestaurantForReview] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserNickname, setCurrentUserNickname] = useState(null);
  const [currentUserAvatarUrl, setCurrentUserAvatarUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    setView("storeDetail");
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setView("map");
    setSelectedRestaurant(null);
    setSelectedRestaurantForReview(null);
  }, []);

  const handleViewRestaurantReviews = useCallback((restaurant) => {
    setSelectedRestaurantForReview(restaurant);
    setView("review");
  }, []);

  const handleBackFromReview = useCallback(() => {
    setView("storeDetail");
  }, []);


  useEffect(() => {
    setSelectedRestaurant(null);
    setSelectedRestaurantForReview(null);
  }, [selectedStation]);

  return (
    <Routes>
      <Route path="/kakao/token" element={<KakaoTokenHandler />} />

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
                flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column",
                alignItems: "center", p: { xs: 1.5, sm: 2, md: 3 },
              }}
            >
              {view === "mypage" ? ( <MyPage setView={setView} /> )
                : view === "vote" ? ( <PollDetailPage /> )
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
                : view === "review" && selectedRestaurantForReview ? (
                  <Box>리뷰 페이지 (구현 예정)</Box>
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
                ) : (
                  <>
                    <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
                    {selectedStation && (
                      <Box sx={{ mt: 3, width: "100%", maxWidth: "900px" }}>
                        <StationInfo
                          stationName={selectedStation.name}
                          onRestaurantSelect={handleRestaurantSelect}
                        />
                      </Box>
                    )}
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