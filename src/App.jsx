import { useState } from "react";
import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";
import MyPage from "./pages/mypage/MyPage";
import PollDetailPage from "./pages/poll/PollDetailPage";
import FreeBoardPage from "./pages/board/FreeBoardPage";
import MealMateBoardPage from "./pages/board/MealMateBoardPage";
import ReviewBoardPage from "./pages/review/ReviewPage";
import StoreManagementPage from "./pages/storemanagement/StoreManagementPage"; // ✅ 추가

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [view, setView] = useState("map");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Sidebar setView={setView} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Header onSearchSelect={setSelectedStation} />

        <main
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {view === "mypage" ? (
            <MyPage setView={setView} /> // ✅ setView 전달
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
          ) : (
            <>
              <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
              {selectedStation && (
                <div
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    maxWidth: "900px",
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
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
