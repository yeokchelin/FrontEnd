import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetroMap from "./components/MetroMap";
import StationInfo from "./components/StationInfo";

function App() {
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",                // 전체 뷰포트에 맞춤
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
        <main style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
        }}>
          <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
          {selectedStation && (
            <div style={{ marginTop: "20px", width: "100%", maxWidth: "900px" }}>
              <StationInfo station={selectedStation} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;