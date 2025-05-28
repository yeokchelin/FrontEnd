// src/App.jsx
import { useState } from "react";
import Sidebar from "./components/main/Sidebar";
import Header from "./components/main/Header";
import MetroMap from "./components/main/MetroMap";
import StationInfo from "./components/main/StationInfo";

// 테스트할 페이지들 임포트
import PollTestPage from './pages/test/PollTestPage';
import StoreManagementPage from './pages/storemanagement/StoreManagementPage';
import ReviewPage from './pages/review/ReviewPage';

// ❗️ BoardPage 임포트는 더 이상 필요 없을 수 있습니다 (아래 설명 참고).
// import BoardPage from "./pages/board/BoardPage"; 
import FreeBoardPage from "./pages/board/FreeBoardPage";     // ❗️ 자유게시판 페이지
import MealMateBoardPage from "./pages/board/MealMateBoardPage"; // ❗️ 밥친구게시판 페이지


function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [showTestMenu, setShowTestMenu] = useState(false);
  const [activeTestPage, setActiveTestPage] = useState('metro'); // 초기값을 'metro'로 명시

  const handleMainTestButtonClick = () => {
    if (activeTestPage && activeTestPage !== 'metro') {
      setActiveTestPage('metro');
      setShowTestMenu(false);
    } else {
      setShowTestMenu(prevShow => !prevShow);
    }
  };

  const selectTestPage = (pageName) => {
    setActiveTestPage(pageName);
    setShowTestMenu(false);
    if (pageName !== 'metro') {
      setSelectedStation(null);
    }
  };

  const renderActivePageContent = () => {
    switch (activeTestPage) {
      case 'poll':
        return <PollTestPage />;
      case 'store':
        return <StoreManagementPage />;
      case 'review':
        return <ReviewPage />;
      case 'freeboard': // ❗️ FreeBoardPage 직접 렌더링
        return <FreeBoardPage />;
      case 'mealmateboard': // ❗️ MealMateBoardPage 직접 렌더링
        return <MealMateBoardPage />;
      case 'metro': // 명시적으로 metro 상태
      default:
        return (
          <>
            <MetroMap selected={selectedStation} onSelect={setSelectedStation} />
            {selectedStation && (
              <div style={{
                marginTop: "20px",
                width: "100%",
                maxWidth: "900px",
                backgroundColor: "var(--background-color)",
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--header-border-color)'
              }}>
                <StationInfo station={selectedStation} />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    }}>
      <Sidebar onNavigate={selectTestPage} currentView={activeTestPage} />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}>
        <Header />
        <div style={{
          padding: '10px',
          textAlign: 'center',
          backgroundColor: 'var(--header-bg-color)',
          borderBottom: '1px solid var(--header-border-color)'
        }}>
          <button
            onClick={handleMainTestButtonClick}
            style={{ /* 기존 버튼 스타일 */ }}
          >
            {(activeTestPage && activeTestPage !== 'metro') ? "지하철 노선도 보기" : (showTestMenu ? "테스트 메뉴 닫기" : "테스트 페이지 메뉴 열기")}
          </button>

          {showTestMenu && (!activeTestPage || activeTestPage === 'metro') && (
            <div className="test-page-submenu" style={{ /* 기존 서브메뉴 스타일 */ }}>
              <button onClick={() => selectTestPage('poll')} style={{ /* 기존 버튼 스타일 */}}>
                투표 기능 테스트
              </button>
              <button onClick={() => selectTestPage('store')} style={{ /* 기존 버튼 스타일 */}}>
                가게 관리 테스트
              </button>
              <button onClick={() => selectTestPage('review')} style={{ /* 기존 버튼 스타일 */}}>
                리뷰 페이지 테스트
              </button>
            </div>
          )}
        </div>

        <main style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          // alignItems: "center", // 각 페이지가 전체 너비를 사용하도록 하려면 이 줄 주석 처리 또는 변경
          paddingTop: (activeTestPage && activeTestPage !== 'metro') ? '20px' : '0',
          paddingLeft: (activeTestPage && activeTestPage !== 'metro') ? '20px' : '0', // 전체적인 패딩은 각 페이지에서 관리하거나 여기서 일괄 적용
          paddingRight: (activeTestPage && activeTestPage !== 'metro') ? '20px' : '0',
        }}>
          {renderActivePageContent()}
        </main>
      </div>
    </div>
  );
}

export default App;