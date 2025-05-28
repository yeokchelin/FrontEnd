import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";
import MyPage from "./pages/mypage/MyPage.jsx";

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // HTML <body>에 클래스 적용
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <Router>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          backgroundColor: isDarkMode ? "#121212" : "#fff", // 배경도 다크/라이트
          color: isDarkMode ? "#f1f1f1" : "#000",
        }}
      >
        <Sidebar setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Header />
          <main
            style={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: isDarkMode ? "#1e1e1e" : "#fff",
              color: isDarkMode ? "#f1f1f1" : "#000",
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
                    {selectedStation && (
                      <div
                        style={{
                          marginTop: "20px",
                          width: "100%",
                          maxWidth: "900px",
                        }}
                      >
                        <StationInfo station={selectedStation} />
                      </div>
                    )}
                  </>
                }
              />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
