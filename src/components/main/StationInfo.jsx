import styles from "./StationInfo.module.css";

export default function StationInfo({ station, restaurants }) {
  return (
    <div className={styles.infoBox}>
      <h2>{station.name}역 근처 음식점</h2>
      {restaurants && restaurants.length > 0 ? (
        <ul>
          {restaurants.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>음식점 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
