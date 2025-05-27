import { useState } from "react";
import styles from "./Header.module.css";
import { mainLineStations, seongsuBranch, sinjeongBranch } from "../data/stationLine2";
import StationInfo from "./StationInfo";

export default function Header({ onSearchSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const allStations = [
    ...mainLineStations,
    ...seongsuBranch.slice(1),
    ...sinjeongBranch.slice(1),
  ];

  const handleSearch = () => {
    const cleaned = searchTerm.replace(/역/g, "").replace(/\s/g, "");

    const matchedStation = allStations.find((station) =>
      station.name.replace(/역/g, "").replace(/\s/g, "") === cleaned
    );

    if (matchedStation) {
      onSearchSelect(matchedStation); // ✅ 이거로 App 상태 업데이트됨!
    } else {
      alert("해당 역을 찾을 수 없어요 😥");
    }
  };

  return (
    <header className={styles.header}>
      <input
        type="text"
        placeholder="새로운 맛을 찾아 떠나볼까요?"
        className={styles.input}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch}>검색</button>
    </header>
  );
}
