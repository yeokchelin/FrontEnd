import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import logo from "../../assets/Logo.jpg";
import RegisterModal from "./Register";
import { kakaoLogin } from "../../utils/KakaoLogin";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);

    const dark = localStorage.getItem("dark-mode") === "true";
    setIsDarkMode(dark);
    if (dark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
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
        console.log("카카오 SDK 로그아웃 완료");
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        navigate("/");
      });
    } else {
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("dark-mode", newMode);
    document.documentElement.classList.toggle("dark-mode", newMode);
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
              {!isLoggedIn ? (
                <>
                  <button className={styles.button} onClick={handleLogin}>로그인</button>
                  <button className={styles.button} onClick={() => setShowRegister(true)}>회원가입</button>
                </>
              ) : (
                <>
                  <button className={styles.button} onClick={handleLogout}>로그아웃</button>
                  <button className={styles.button} onClick={() => navigate("/mypage")}>마이페이지</button>
                </>
              )}
              <button className={styles.button}>게시판</button>
            </div>

            <div className={styles.themeToggle}>
              <button className={styles.button} onClick={toggleDarkMode}>
                {isDarkMode ? "☀️ 라이트모드" : "🌙 다크모드"}
              </button>
            </div>
          </>
        )}
      </aside>

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
