import React, { useState } from "react"; // useState 훅 필요
// import Sidebar from "./components/Sidebar"; // 테스트 시 주석 처리
// import Header from "./components/Header";   // 테스트 시 주석 처리
// import MetroMap from "./components/MetroMap"; // 테스트 시 주석 처리
// import StationInfo from "./components/StationInfo"; // 테스트 시 주석 처리

import ReviewPage from "./pages/ReviewPage"; // ReviewPage 임포트
import "./App.css"; // App.css 임포트 (다크 모드 스타일 정의를 위해)

function App() {
  // const [selectedStation, setSelectedStation] = useState(null); // 테스트 시 필요 없음
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태 추가

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); // 다크 모드 상태 토글
  };

  return (
    // 최상위 div에 dark-mode 클래스를 조건부로 적용
    <div className={isDarkMode ? "dark-mode" : ""} style={{
      display: "flex",
      height: "100vh",
      width: "100vw", // 전체 뷰포트에 맞춤
      overflow: "hidden",
    }}>
      {/* <Sidebar /> */} {/* 사이드바 주석 처리 */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0, // flexbox shrink-safe
      }}>
        {/* <Header /> */} {/* 헤더 주석 처리 */}
        <main
          style={{
            flex: 1,
            overflowY: "auto", // 세로 스크롤 가능
            // background: "#f0f2f5", // 이 부분은 App.css에서 .main-content-light/dark로 제어하는 것이 좋습니다.
            display: "flex",
            justifyContent: "center", // 리뷰 페이지를 중앙에 정렬
            alignItems: "flex-start", // 상단부터 콘텐츠 시작
            paddingTop: "20px", // 상단 여백
            paddingBottom: "20px", // 하단 여백
          }}
          // main 태그의 배경색은 App.css에서 제어하도록 클래스 추가
          className={isDarkMode ? "main-content-dark" : "main-content-light"}
        >
          {/* 리뷰 페이지를 직접 렌더링 */}
          <ReviewPage />

          {/* 기존 지하철 관련 컴포넌트들은 테스트를 위해 주석 처리하거나 삭제합니다. */}
          {/* <MetroMap selected={selectedStation} onSelect={setSelectedStation} /> */}
          {/* {selectedStation && (
            <div style={{ marginTop: "20px", width: "100%", maxWidth: "900px" }}>
              <StationInfo station={selectedStation} />
            </div>
          )} */}
        </main>
      </div>
      {/* 다크 모드 토글 버튼 (테스트용) */}
      <button onClick={toggleDarkMode} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100 }}>
        {isDarkMode ? "라이트 모드" : "다크 모드"}
      </button>
    </div>
  );
}

export default App;