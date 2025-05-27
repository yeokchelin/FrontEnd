import { useState } from "react";
import styles from "./Sidebar.module.css";
import logo from "../assets/Logo.jpg";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* ✅ 토글 버튼은 항상 보이게 유지 */}
      <div className={styles.toggleContainer}>
        <button onClick={() => setCollapsed(!collapsed)} className={styles.toggle}>
          ☰
        </button>
      </div>

      {/* ✅ 사이드바 펼쳐졌을 때만 내용 보이기 */}
      {!collapsed && (
        <>
          {/* ✅ 로고도 여기서 조건부 렌더링 */}
          <div className={styles.logoContainer}>
            <img src={logo} alt="로고" className={styles.logo} />
          </div>

          <div>
            <h2 className={styles.title}>Side Bar</h2>
            <button className={styles.button}>로그인</button>
            <button className={styles.button}>회원가입</button>
            <button className={styles.button}>게시판</button>
          </div>
        </>
      )}
    </aside>
  );
}
