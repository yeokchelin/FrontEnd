import styles from "./MetroMap.module.css";
import subwayMap from "../assets/subway-map.png";

export default function MetroMap() {
  return (
    <div className={styles.container}>
      <img src={subwayMap} alt="Seoul Metro Map" className={styles.image} />
    </div>
  );
}
