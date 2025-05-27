import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetroMap from "./components/MetroMap";
import StationInfo from "./components/StationInfo";

function App() {
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main
          style={{
            flex: 1,
            overflow: "auto",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
          {selectedStation && (
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", width: "100%" }}>
              <StationInfo station={selectedStation} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
