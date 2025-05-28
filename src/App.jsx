import { useState } from "react";
import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";
import MyPage from "./pages/mypage/MyPage"; // ✅ 마이페이지 추가

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [view, setView] = useState("map"); // ✅ 상태 추가: 현재 뷰

  // ❗️ 테스트 페이지 표시/숨김 토글 함수
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    }}>
      <Sidebar setView={setView} /> {/* ✅ Sidebar에 상태 setter 전달 */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}>
        <Header />
        <main style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {view === "mypage" ? (
            <MyPage />
          ) : (
            <>
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