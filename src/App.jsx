import { useState, useEffect } from "react";
import axios from "axios";
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

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [restaurantData, setRestaurantData] = useState([]);
  const [view, setView] = useState("map");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!selectedStation) return;

      try {
        const response = await axios.post("http://localhost:8080/api/restaurants/by-station", {
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
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Sidebar setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
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
                  <StationInfo station={selectedStation} restaurants={restaurantData} />
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
