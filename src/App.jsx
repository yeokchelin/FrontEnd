// src/App.jsx
import { useState } from "react";
import Sidebar from "./components/main/Sidebar";     // 경로는 이미 수정된 것으로 가정
import Header from "./components/main/Header";       // 경로는 이미 수정된 것으로 가정
import MetroMap from "./components/main/MetroMap";   // 경로는 이미 수정된 것으로 가정
import StationInfo from "./components/main/StationInfo"; // 경로는 이미 수정된 것으로 가정

// ❗️ PollTestPage 임포트 추가 (경로는 실제 파일 위치에 맞게 조정해주세요)
import PollTestPage from './pages/test/PollTestPage'; 

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  // ❗️ PollTestPage 표시 여부를 위한 상태 추가
  const [showPollTestPage, setShowPollTestPage] = useState(false);

  // ❗️ 테스트 페이지 표시/숨김 토글 함수
  const togglePollTestPage = () => {
    setShowPollTestPage(prevShow => !prevShow);
    // 테스트 페이지로 전환 시 선택된 역 정보 초기화 (선택 사항)
    if (!showPollTestPage) { // 즉,これから PollTestPage를 보여줄 것이라면
        setSelectedStation(null);
    }
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,                  // flexbox shrink-safe
      }}>
        <Header onSearchSelect={setSelectedStation} />
        
        {/* ❗️ 테스트 페이지 토글 버튼 (임시 위치 및 스타일) */}
        <main style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // PollTestPage도 중앙 정렬될 수 있음, 필요시 조정
          // background: "#fff", // PollTestPage 배경과 겹칠 수 있으므로, PollTestPage에서 자체 배경 관리
        }}>
          {/* ❗️ 조건부 렌더링: showPollTestPage 상태에 따라 다른 내용을 표시 */}
          {showPollTestPage ? (
            <PollTestPage />
          ) : (
            <> {/* 기존 지하철 노선도 앱 내용 */}
              <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
              {selectedStation && (
                <div style={{ marginTop: "20px", width: "100%", maxWidth: "900px", background: "#fff", padding: '20px', borderRadius: '8px' }}>
                  <StationInfo station={selectedStation} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;