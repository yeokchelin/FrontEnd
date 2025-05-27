import styles from "./StationInfo.module.css";

const restaurantData = {
  seoul: ["백종원김밥", "역전우동", "서울돈까스"],
  cityhall: ["광화문족발", "시청국밥", "도시락천국"],
  jonggak: ["종로피자", "짜장면천국", "포케하와이"],
  jongno3: ["곱창이야기", "떡볶이포차", "김치찜전문점"],
};

export default function StationInfo({ station }) {
  const restaurants = restaurantData[station.code] || [];

  return (
    <div className={styles.infoBox}>
      <h2>{station.name}역 근처 음식점</h2>
      <ul>
        {restaurants.map((name, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
