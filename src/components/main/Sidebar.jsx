// src/components/main/SideBar.jsx
// Sidebar.jsx
import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom"; // Link 사용 안 함
import styles from "./Sidebar.module.css";
import logo from "../../assets/Logo.png";
import RegisterModal from "./Register";
import { kakaoLogin } from "../../utils/KakaoLogin";

export default function SideBar({ onNavigate, currentView }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBoardSubMenu, setShowBoardSubMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    kakaoLogin()
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error("로그인 실패:", err);
      });
  };

  const handleLogout = () => {
    const kakao = window.Kakao;
    if (kakao && kakao.Auth && kakao.Auth.getAccessToken()) {
      kakao.Auth.logout(() => {
        console.log("카카오 SDK 로그아웃 완료");
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setView("metro"); // 로그아웃 시 홈 화면으로
      });
    } else {
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      setView("metro"); // 로그아웃 시 홈 화면으로
    }
  };

  const toggleBoardSubMenu = () => {
    setShowBoardSubMenu(prevShow => !prevShow);
  };

  const handleNavigation = (pageKey) => {
    onNavigate(pageKey);
    setShowBoardSubMenu(false);
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.toggleContainer}>
          <button onClick={() => setCollapsed(!collapsed)} className={styles.toggleButton}>
            {collapsed ? "▶" : "☰"}
          </button>
        </div>

        {!collapsed && (
          <div className={styles.menuContent}>
            <div className={styles.logoContainer}>
              <button onClick={() => handleNavigation('metro')} className={styles.logoLinkButton}>
                <img src={logo} alt="로고" className={styles.logo} />
              </button>
            </div>

            <nav className={styles.navItems}>
              {!isLoggedIn ? (
                <>
                  <button className={`${styles.navButton} ${styles.authButton}`} onClick={handleLogin}>
                    로그인
                  </button>
                  <button
                    className={`${styles.navButton} ${styles.authButton}`}
                    onClick={() => setShowRegister(true)}
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.button} onClick={() => setView("mypage")}>
                    마이페이지
                  </button>
                </>
              )}

              <hr className={styles.divider} />

              <div className={styles.boardMenuItemContainer}>
                <button
                  className={`${styles.navButton} ${styles.boardToggleButton}`}
                  onClick={toggleBoardSubMenu}
                  aria-expanded={showBoardSubMenu}
                  aria-controls="board-submenu"
                >
                  게시판
                  <span className={`${styles.arrow} ${showBoardSubMenu ? styles.arrowUp : styles.arrowDown}`}></span>
                </button>
                {showBoardSubMenu && (
                  <div id="board-submenu" className={styles.boardSubMenu}>
                    <button onClick={() => handleNavigation('poll')} className={styles.subMenuItem}>
                      투표게시판
                    </button>
                    <button onClick={() => handleNavigation('freeboard')} className={styles.subMenuItem}>
                      자유게시판
                    </button>
                    <button onClick={() => handleNavigation('mealmateboard')} className={styles.subMenuItem}>
                      밥친구 구하기
                    </button>
                    <button onClick={() => handleNavigation('review')} className={styles.subMenuItem}>
                      리뷰 게시판
                    </button>
                  </div>
                )}
              </div>
              
              {/* ❗️ "내 가게 관리" 버튼 및 관련 조건부 렌더링 삭제됨 */}
              {/* {isLoggedIn && (
                <button onClick={() => handleNavigation('store')} className={styles.navButton}>
                  내 가게 관리
                </button>
              )} 
              */}
            </nav>
            <hr />
            <button className={styles.button}>게시판</button>
            {isLoggedIn && (
              <>
                <button className={styles.button}>즐겨찾기</button>                
                <button className={styles.buttonLogOut} onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            )}
          </div>
        )}
      </aside>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}