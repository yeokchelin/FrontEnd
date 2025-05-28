import styles from "./Sidebar.module.css";
import logo from "../../assets/Logo.jpg";

export default function Sidebar() {
  return (
    <aside className={styles.sideBar}>
      <div className={styles.sideMenu}>
        <h2 className={styles.title}><img src={logo} alt="logoMain" className={styles.image} /></h2>
        <div className={styles.userContainer}>
          <button className={styles.signIn}>로그인</button>
          <button className={styles.register}>회원가입</button>
        </div>
        <hr/>
        <button className={styles.board}>게시판</button>
      </div>
      {/* <div className={styles.bottomButtons}>
        <button className={styles.save}>Save</button>
        <button className={styles.cancel}>Cancel</button>
      </div> */}
    </aside>
  );
}