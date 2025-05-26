import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        <h2 className={styles.title}>Side Bar</h2>
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
