// src/components/main/MetroMap.jsx
import { useTheme } from '@mui/material/styles'; // MUI useTheme 훅 임포트
import { mainLineStations, seongsuBranch, sinjeongBranch } from "../../data/stationLine2";

export default function MetroMap({ onSelect }) {
  const theme = useTheme(); // 현재 MUI 테마 객체 가져오기

  const allStations = [...mainLineStations, ...seongsuBranch.slice(1), ...sinjeongBranch.slice(1)];

  return (
    <svg
      viewBox="0 0 2000 650" // viewBox는 유지하거나 필요에 따라 조정
      width="100%"
      height="auto" // height를 auto로 설정하면 viewBox 비율에 맞춰짐
      preserveAspectRatio="xMidYMin meet"
      style={{
        maxWidth: "100%",
        // height: "auto", // 위에서 설정했으므로 중복 제거 가능
        border: `1px solid ${theme.palette.divider}`, // 테마의 divider 색상 사용
        // 필요하다면 SVG 자체의 배경색도 테마에 맞게 설정할 수 있습니다.
        // backgroundColor: theme.palette.background.default,
      }}
    >
      {/* --- 노선 --- */}
      {/* 노선 색상(stroke)은 현재 고유색으로 유지합니다. 테마에 따라 변경 원하시면 수정 필요 */}
      <polyline
        points={mainLineStations.map((s) => `${s.x},${s.y}`).join(" ")}
        fill="none"
        stroke="green" // 예: 2호선 본선 색상
        strokeWidth="4"
      />
      <polyline
        points={seongsuBranch.map((s) => `${s.x},${s.y}`).join(" ")}
        fill="none"
        stroke="#00aaff" // 예: 성수지선 색상
        strokeWidth="3"
        strokeDasharray="5,5"
      />
      <polyline
        points={sinjeongBranch.map((s) => `${s.x},${s.y}`).join(" ")}
        fill="none"
        stroke="#ff9900" // 예: 신정지선 색상
        strokeWidth="3"
        strokeDasharray="5,5"
      />

      {/* --- 역 --- */}
      {allStations.map((station) => (
        <g key={station.name}>
          <circle
            cx={station.x}
            cy={station.y}
            r={8} // 원의 반지름
            fill={theme.palette.background.paper} // 원의 내부 색상을 테마의 paper 배경색으로
            stroke="#22c55e" // 역 테두리 색상 (2호선 계열 녹색 유지)
                               // 이 색상도 테마에 따라 변경 원하시면 수정 가능
            strokeWidth="3"
            onClick={() => onSelect(station)}
            style={{ cursor: "pointer" }}
          />
          <text
            x={station.x + 12} // 텍스트 위치 조정 (기존 +10에서 약간 더 띄움)
            y={station.y - 12} // 텍스트 위치 조정 (기존 -10에서 약간 더 띄움)
            fontSize="12" // 폰트 크기
            textAnchor="start" // 텍스트 정렬 기준
            alignmentBaseline="middle"
            fill={theme.palette.text.primary} // 텍스트 색상을 테마의 주요 텍스트 색상으로
            style={{ pointerEvents: 'none' }} // 텍스트에는 클릭 이벤트 방지 (원만 클릭되도록)
          >
            {station.name}
          </text>
        </g>
      ))}
    </svg>
  );
}