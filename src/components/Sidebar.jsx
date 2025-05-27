import styles from "./Sidebar.module.css";
import logo from "../assets/logo_main.jpg";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        <h2 className={styles.title}><img src={logo} alt="logoMain" className={styles.image} /></h2>
        <button className={styles.signin}>Sign in</button>
        <button className={styles.register}>Register</button>
      </div>
      <div className={styles.bottomButtons}>
        <button className={styles.save}>Save</button>
        <button className={styles.cancel}>Cancel</button>
      </div>
    </aside>
  );
}
