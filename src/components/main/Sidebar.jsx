// Sidebar.jsx
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import logo from "../../assets/Logo.png";
import RegisterModal from "./Register";
import { kakaoLogin } from "../../utils/KakaoLogin";

export default function SideBar({ setView }) { // ✅ setView props 받기
  const [collapsed, setCollapsed] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    if (kakao?.Auth?.getAccessToken()) {
      kakao.Auth.logout(() => {
        console.log("카카오 SDK 로그아웃 완료");
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setView("map"); // ✅ 로그아웃 시 홈 화면으로
      });
    } else {
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      setView("map"); // ✅ 로그아웃 시 홈 화면으로
    }
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.toggleContainer}>
          <button onClick={() => setCollapsed(!collapsed)} className={styles.toggle}>☰</button>
        </div>

        {!collapsed && (
          <>
            <div className={styles.logoContainer}>
              <img src={logo} alt="로고" className={styles.logo} />
            </div>

            <div>
              {/* 로그인 상태에 따른 조건부 렌더링 */}
              {!isLoggedIn ? (
                <>
                  <button className={styles.button} onClick={handleLogin}>
                    로그인 / 회원가입
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.button} onClick={() => setView("mypage")}>
                    마이페이지
                  </button>
                </>
              )}
            </div>
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
          </>
        )}
      </aside>

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}