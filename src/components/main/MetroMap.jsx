import { mainLineStations, seongsuBranch, sinjeongBranch } from "../../data/stationLine2";

export default function MetroMap({  onSelect }) {
  const allStations = [...mainLineStations, ...seongsuBranch.slice(1), ...sinjeongBranch.slice(1)];

  return (
    <svg
      viewBox="0 0 2000 650"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMin meet"
      style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc" }}
    >
      <polyline points={mainLineStations.map((s) => `${s.x},${s.y}`).join(" ")} fill="none" stroke="green" strokeWidth="4" />
      <polyline points={seongsuBranch.map((s) => `${s.x},${s.y}`).join(" ")} fill="none" stroke="#00aaff" strokeWidth="3" strokeDasharray="5,5" />
      <polyline points={sinjeongBranch.map((s) => `${s.x},${s.y}`).join(" ")} fill="none" stroke="#ff9900" strokeWidth="3" strokeDasharray="5,5" />

      {allStations.map((station) => (
        <g key={station.name}>
          <circle
            cx={station.x}
            cy={station.y}
            r={8}
            fill="#fff"
            stroke="#22c55e"
            strokeWidth="3"
            onClick={() => onSelect(station)}
            style={{ cursor: "pointer" }}
          />
          <text
            x={station.x + 10}
            y={station.y - 10}
            fontSize="12"
            textAnchor="start"
            alignmentBaseline="middle"
          >
            {station.name}
          </text>
        </g>
      ))}
    </svg>
  );
}