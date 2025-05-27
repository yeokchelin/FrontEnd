// src/App.jsx
// --- 원본 App 컴포넌트 코드 (전체 주석 처리) ---
import { useState } from "react";
import Sidebar from "./components/main/Sidebar";     // 경로 수정
import Header from "./components/main/Header";       // 경로 수정
import MetroMap from "./components/main/MetroMap";   // 경로 수정
import StationInfo from "./components/main/StationInfo"; // 경로 수정

function App() {
  const [selectedStation, setSelectedStation] = useState(null);

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
        minWidth: 0,
      }}>
        <Header />
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



// // --- 게시판 기능 테스트용 코드 (주석을 해제하고 사용하세요)---
// import React, { useState } from "react";
// // React Router 관련 임포트 (BrowserRouter는 main.jsx에서 임포트하므로 여기서는 제거)
// import { Routes, Route, Link } from 'react-router-dom';

// // 게시판 페이지 임포트
// import BoardPage from "./pages/board/BoardPage";
// import FreeBoardPage from "./pages/board/FreeBoardPage";
// import MealMateBoardPage from "./pages/board/MealMateBoardPage";

// // App 전체의 스타일 및 다크 모드 스타일을 위한 App.css 임포트
// import "./App.css";

// // 테스트를 위한 더미 홈 컴포넌트
// const TestHomePage = ({ isDarkMode }) => (
//   <div style={{
//     textAlign: 'center',
//     padding: '50px',
//     backgroundColor: isDarkMode ? '#3e4451' : '#ffffff',
//     color: isDarkMode ? '#eee' : '#333',
//     borderRadius: '10px',
//     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//     transition: 'background-color 0.3s, color 0.3s'
//   }}>
//     <h1>환영합니다!</h1>
//     <p>아래 게시판으로 이동하여 기능을 테스트하세요.</p>
//     <Link to="/board" style={{
//       display: 'inline-block',
//       marginTop: '20px',
//       padding: '10px 20px',
//       backgroundColor: isDarkMode ? '#61dafb' : '#007bff',
//       color: 'white',
//       textDecoration: 'none',
//       borderRadius: '5px',
//       fontSize: '1.2em',
//       transition: 'background-color 0.3s'
//     }}>게시판으로 이동</Link>
//   </div>
// );


// function App() { // App 컴포넌트 이름은 유지
//   const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode); // 다크 모드 상태 토글
//   };

//   return (
//     // 최상위 div
//     <div className={isDarkMode ? "dark-mode" : ""} style={{
//       display: "flex",
//       height: "100vh",
//       width: "100vw", // 전체 뷰포트에 맞춤
//       overflow: "hidden",
//     }}>
//       {/* BrowserRouter는 main.jsx에서 App을 감싸므로 여기서는 사용하지 않습니다. */}
//       {/* 테스트 목적상 Sidebar, Header 등은 렌더링하지 않음 */}
//       <div style={{
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         minWidth: 0,
//       }}>
//         <main
//           style={{
//             flex: 1,
//             overflowY: "auto", // 세로 스크롤 가능
//             display: "flex",
//             justifyContent: "center", // 게시판 페이지를 중앙에 정렬
//             alignItems: "flex-start", // 상단부터 콘텐츠 시작
//             paddingTop: "20px", // 상단 여백
//             paddingBottom: "20px", // 하단 여백
//           }}
//           // main 태그의 배경색은 App.css에서 제어
//           className={isDarkMode ? "main-content-dark" : "main-content-light"}
//         >
//           {/* Routes 컴포넌트가 main 태그 안에 직접 렌더링됩니다. */}
//           <Routes> {/* 라우팅 규칙 정의 */}
//             <Route path="/" element={<TestHomePage isDarkMode={isDarkMode} />} />
//             <Route path="/board" element={<BoardPage />}>
//               <Route index element={<FreeBoardPage />} />
//               <Route path="free" element={<FreeBoardPage />} />
//               <Route path="mealmate" element={<MealMateBoardPage />} />
//             </Route>
//           </Routes>
//         </main>
//       </div>
//       {/* 다크 모드 토글 버튼 (테스트용) */}
//       <button onClick={toggleDarkMode} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100 }}>
//         {isDarkMode ? "라이트 모드" : "다크 모드"}
//       </button>
//     </div>
//   );
// }

// export default App;