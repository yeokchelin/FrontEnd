import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MetroMap from "./components/MetroMap";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, overflow: "auto", background: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <MetroMap />
        </main>
      </div>
    </div>
  );
}

export default App;
