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

import getAppTheme from "./theme/muiTheme.js";

import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";
import MyPage from "./pages/mypage/MyPage";
import FreeBoardPage from "./pages/board/FreeBoardPage";
import MealMateBoardPage from "./pages/board/MealMateBoardPage";
import ReviewPage from "./pages/review/ReviewPage"; // ⭐ 경로 및 컴포넌트 이름 확인 (ReviewBoardPage -> ReviewPage)
import StoreManagementPage from "./pages/storemanagement/StoreManagementPage";
import ChangeGradePage from "./pages/grade/ChangeGradePage";
import KakaoTokenHandler from "./pages/KakaoTokenHandler";
import StoreDetailPage from "./pages/storedetail/StoreDetailPage.jsx"; // ⭐ 경로 및 컴포넌트 이름 확인 (StoreDetail -> StoreDetailPage)
import TodayMenuPage from "./pages/todaymenu/TodayMenuPage";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppContent() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [view, setView] = useState("map");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // StationInfo에서 선택된 Restaurant 객체 (id, name 등)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurantForReview, setSelectedRestaurantForReview] = useState(null); // ⭐️ 리뷰 대상 Restaurant 객체 상태

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const handleRestaurantSelect = useCallback((restaurant) => {
    console.log('[AppContent] StationInfo에서 식당 선택됨 (handleRestaurantSelect):', restaurant);
    setSelectedRestaurant(restaurant); // Restaurant 객체 저장
    setView("storeDetail");
  }, []);

  const handleBackFromDetail = useCallback(() => {
    console.log('[AppContent] 상세 페이지에서 목록/맵으로 돌아가기');
    setView("map"); // 또는 이전 뷰로 설정
    setSelectedRestaurant(null);
    setSelectedRestaurantForReview(null); // 상세에서 돌아올 때 리뷰 대상도 초기화
    // navigate('/'); // 라우터 사용 시 홈으로 이동
  }, []);

  // ⭐️ StoreDetailPage에서 리뷰 보기 클릭 시 호출될 함수
  const handleViewRestaurantReviews = useCallback((restaurant) => { // ⭐ Restaurant 객체를 인자로 받음 (id, name 등 포함)
    console.log('[AppContent] 리뷰 보기 선택됨 (handleViewRestaurantReviews):', restaurant);
    setSelectedRestaurantForReview(restaurant); // 리뷰를 볼 식당 정보 저장
    setView("review"); // 리뷰 페이지로 view 상태 변경
  }, []);

  // ⭐️ ReviewPage에서 뒤로가기 클릭 시 호출될 함수
  const handleBackFromReview = useCallback(() => {
    console.log('[AppContent] 리뷰 페이지에서 식당 상세로 돌아가기');
    setView("storeDetail"); // 식당 상세 페이지로 돌아가기
    // selectedRestaurantForReview는 그대로 두어 StoreDetail이 다시 렌더링될 때 사용할 수 있도록 합니다.
    // 필요하다면 setSelectedRestaurantForReview(null);
  }, []);


  useEffect(() => {
    // 역이 변경되면, 현재 선택된 식당 및 리뷰 대상 식당 초기화
    setSelectedRestaurant(null);
    setSelectedRestaurantForReview(null);
    // 필요하다면 setView("map"); 추가하여 기본 뷰로 이동
  }, [selectedStation]);

  return (
    <Routes>
      <Route path="/kakao/token" element={<KakaoTokenHandler />} />
      <Route path="*" element={(
        <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", bgcolor: 'background.default' }}>
          <Sidebar setView={setView} />
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
                : view === "todayMenu" ? ( <TodayMenuPage /> )
                : view === "free" ? ( <FreeBoardPage /> )
                : view === "mate" ? ( <MealMateBoardPage /> )
                // ⭐️ 리뷰 페이지 렌더링 조건 및 prop 전달
                : view === "review" && selectedRestaurantForReview ? (
                  <ReviewPage // ⭐ 컴포넌트 이름 ReviewBoardPage -> ReviewPage
                    restaurant={selectedRestaurantForReview} // Restaurant 객체 (id, name 필드 포함)
                    onBack={handleBackFromReview} // ⭐ ReviewPage에서 뒤로가기 클릭 시 호출될 함수 전달
                  />
                )
                : view === "manageStore" ? ( <StoreManagementPage /> )
                : view === "changeGrade" ? ( <ChangeGradePage /> )
                // ⭐️ StoreDetailPage 렌더링 조건 및 prop 전달
                : view === "storeDetail" && selectedRestaurant ? (
                  <StoreDetailPage // ⭐ 컴포넌트 이름 StoreDetail -> StoreDetailPage
                    restaurantId={selectedRestaurant.id} // Restaurant 객체의 PK 필드명은 'id'이므로 selectedRestaurant.id로 넘김
                    onBack={handleBackFromDetail}
                    onViewReviews={handleViewRestaurantReviews} // ⭐ 콜백 함수 전달
                  />
                ) : (
                  <>
                    <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
                    {selectedStation && (
                      <Box sx={{ mt: 3, width: "100%", maxWidth: "900px" }}>
                        <StationInfo
                          stationName={selectedStation.name}
                          onRestaurantSelect={handleRestaurantSelect} // StationInfo에서 선택된 식당 (Restaurant 객체) 전달
                          // Header의 selectedCategory를 StationInfo에 전달하여 필터링에 사용하려면
                          // selectedCategoryFromHeader={selectedCategory} 와 같이 전달하고 StationInfo 내부 로직 수정 필요
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
        {/* BrowserRouter는 App.jsx를 감싸는 index.js나 main.jsx에 있어야 합니다. */}
        {/* 만약 App.jsx가 최상위라면 <BrowserRouter>로 <AppContent />를 감싸야 합니다. */}
        {/* 현재 코드에는 BrowserRouter가 없으므로, 이미 외부에 있다고 가정합니다. */}
        <AppContent />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}