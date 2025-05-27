import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import logo from "../assets/Logo.jpg";
import RegisterModal from "./Register";
import { kakaoLogin } from "../utils/KakaoLogin"; // 주의: 파일명 대소문자 일치

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 새로고침해도 로그인 상태 유지
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  // 로그인 처리
  const handleLogin = () => {
    kakaoLogin()
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error("로그인 실패:", err);
      });
  };

  // 로그아웃 처리
  const handleLogout = () => {
  const kakao = window.Kakao;

  if (kakao && kakao.Auth && kakao.Auth.getAccessToken()) {
    kakao.Auth.logout(function () {
      console.log("카카오 SDK 로그아웃 완료");
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
    });
  } else {
    // SDK가 초기화되지 않았거나 이미 토큰 없음
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  }
};


  return (
    <>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.toggleContainer}>
          <button onClick={() => setCollapsed(!collapsed)} className={styles.toggle}>
            ☰
          </button>
        </div>

        {!collapsed && (
          <>
            <div className={styles.logoContainer}>
              <img src={logo} alt="로고" className={styles.logo} />
            </div>

            <div>
              <h2 className={styles.title}>Side Bar</h2>

              {/* 로그인 상태에 따른 조건부 렌더링 */}
              {!isLoggedIn ? (
                <>
                  <button className={styles.button} onClick={handleLogin}>
                    로그인
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => setShowRegister(true)}
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.button} onClick={handleLogout}>
                    로그아웃
                  </button>
                  <button className={styles.button}>마이페이지</button>
                </>
              )}

              <button className={styles.button}>게시판</button>
            </div>
          </>
        )}
      </aside>

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
