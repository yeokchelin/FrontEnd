import styles from "./Register.module.css";

export default function RegisterModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>회원가입</h2>
        <input type="text" placeholder="아이디" className={styles.input} />
        <input type="password" placeholder="비밀번호" className={styles.input} />
        <button className={styles.submit}>가입하기</button>
        <button className={styles.close} onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
