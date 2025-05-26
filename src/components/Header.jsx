import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <input
        type="text"
        placeholder="새로운 맛을 찾아 떠나볼까요?"
        className={styles.input}
      />
      <button className={styles.close}>&times;</button>
    </header>
  );
}
