import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import logo from "../../assets/Logo.png";
import RegisterModal from "./Register";
import { kakaoLogin } from "../../utils/KakaoLogin";

export default function SideBar({ setView }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false); // ✅ 게시판 열림 상태

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    kakaoLogin()
      .then(() => setIsLoggedIn(true))
      .catch((err) => console.error("로그인 실패:", err));
  };

  const handleLogout = () => {
    const kakao = window.Kakao;
    if (kakao?.Auth?.getAccessToken()) {
      kakao.Auth.logout(() => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setView("map");
      });
    } else {
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      setView("map");
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
              <img src={logo} alt="로고" className={styles.logo} onClick={() => setView("map")} style={{ cursor: "pointer" }} />
            </div>

            <div>
              {!isLoggedIn ? (
                <button className={styles.button} onClick={handleLogin}>로그인</button>
              ) : (
                <button className={styles.button} onClick={() => setView("mypage")}>마이페이지</button>
              )}
            </div>

            <hr />

            {/* ✅ 게시판 버튼 및 하위 메뉴 */}
            <button className={styles.button} onClick={() => setBoardOpen(!boardOpen)}>
              게시판 {boardOpen ? "▲" : "▼"}
            </button>
            {boardOpen && (
              <div className={styles.subMenu}>
                <button className={styles.subButton} onClick={() => setView("vote")}>투표게시판</button>
                <button className={styles.subButton} onClick={() => setView("free")}>자유게시판</button>
                <button className={styles.subButton} onClick={() => setView("mate")}>밥친구 구하기</button>
                <button className={styles.subButton} onClick={() => setView("review")}>리뷰 게시판</button>
              </div>
            )}

            {isLoggedIn && (
              <>
                <button className={styles.button} onClick={() => setView("favorites")}>회원등급 변경하기</button>
                <button className={styles.buttonLogOut} onClick={handleLogout}>로그아웃</button>
              </>
            )}
          </>
        )}
      </aside>

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
