// src/App.jsx
import { useState, useEffect, useMemo, createContext, useContext } from "react";
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
import api from "./api/axiosInstance";

// 사용자 정의 컴포넌트
import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";
import MyPage from "./pages/mypage/MyPage";
import PollDetailPage from "./pages/poll/PollDetailPage";
import FreeBoardPage from "./pages/board/FreeBoardPage";
import MealMateBoardPage from "./pages/board/MealMateBoardPage";
import ReviewBoardPage from "./pages/review/ReviewPage";
import StoreManagementPage from "./pages/storemanagement/StoreManagementPage";
import ChangeGradePage from "./pages/grade/ChangeGradePage";
import KakaoTokenHandler from "./pages/KakaoTokenHandler";

// 테마 컨텍스트
const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppContent() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [restaurantData, setRestaurantData] = useState([]);
  const [view, setView] = useState("map");

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!selectedStation) return;

      try {
        const response = await api.post("/api/restaurants/by-station", {
          stationName: selectedStation.name,
        });
        setRestaurantData(response.data);
      } catch (err) {
        console.error("음식점 정보를 불러오는 중 오류:", err);
        setRestaurantData([]);
      }
    };

    fetchRestaurantData();
  }, [selectedStation]);

  return (
    <Routes>
      <Route path="/kakao/token" element={<KakaoTokenHandler />} />
      <Route path="*" element={(
        <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", bgcolor: 'background.default' }}>
          <Sidebar setView={setView} />
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {/* 헤더 */}
            <Box
              component="header"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                bgcolor: 'background.paper',
                borderBottom: `1px solid ${theme.palette.divider}`,
                minHeight: '64px',
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Header onSearchSelect={setSelectedStation} />
              </Box>
              <IconButton
                sx={{ ml: 1 }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
                aria-label={theme.palette.mode === 'dark' ? "라이트 모드로 변경" : "다크 모드로 변경"}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>

            {/* 본문 */}
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
              {view === "mypage" ? (
                <MyPage setView={setView} />
              ) : view === "vote" ? (
                <PollDetailPage />
              ) : view === "free" ? (
                <FreeBoardPage />
              ) : view === "mate" ? (
                <MealMateBoardPage />
              ) : view === "review" ? (
                <ReviewBoardPage />
              ) : view === "manageStore" ? (
                <StoreManagementPage />
              ) : view === "changeGrade" ? (
                <ChangeGradePage />
              ) : (
                <>
                  <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
                  {selectedStation && (
                    <Box sx={{ mt: 3, width: "100%", maxWidth: "900px" }}>
                      <StationInfo station={selectedStation} restaurants={restaurantData} />
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
