import { useEffect, useState } from "react";
import styles from "./Mypage.module.css";

export default function Mypage({ setView }) {
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userLevel, setUserLevel] = useState("");

  useEffect(() => {
    setReviews([
      { id: 1, place: "강남 맛집", content: "진짜 맛있었어요!" },
      { id: 2, place: "홍대 카페", content: "분위기 굿!" },
    ]);
    setFavorites([
      { id: 1, name: "이태원 파스타집" },
      { id: 2, name: "한남동 디저트" },
    ]);
    setUserLevel("점주");
  }, []);

  const handleManageStore = () => {
    setView("manageStore");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>마이페이지</h1>

      <div className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.subheading}>나의 리뷰</h2>
          <ul className={styles.reviewList}>
            {reviews.map((review) => (
              <li key={review.id}>
                <strong>{review.place}</strong>: {review.content}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subheading}>찜한 가게</h2>
          <ul className={styles.storeList}>
            {favorites.map((fav) => (
              <li key={fav.id}>{fav.name}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className={styles.bottomSection}>
        <section className={styles.levelSection}>
          <h2 className={styles.subheading}>회원 등급</h2>
          <p className={styles.level}>{userLevel} 회원</p>
        </section>

        <div className={styles.buttonContainer}>
          <button className={styles.manageButton} onClick={handleManageStore}>
            내 가게 관리
          </button>
        </div>
      </div>
    </div>
  );
}
