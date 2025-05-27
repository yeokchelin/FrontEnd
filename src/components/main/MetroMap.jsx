export default function MetroMap({  onSelect }) {
  const mainLineStations = [
    { name: "시청", code: "cityhall", x: 530, y: 200 },
    { name: "을지로입구", code: "euljiro1", x: 590, y: 200 },
    { name: "을지로3가", code: "euljiro3", x: 670, y: 200 },
    { name: "을지로4가", code: "euljiro4", x: 740, y: 200 },
    { name: "동대문역사문화공원", code: "ddp", x: 820, y: 200 },
    { name: "신당", code: "sindang", x: 970, y: 200 },
    { name: "상왕십리", code: "sangwangsimni", x: 1040, y: 200 },
    { name: "왕십리", code: "wangsimni", x: 1120, y: 200 },
    { name: "한양대", code: "hanyang", x: 1180, y: 200 },
    { name: "뚝섬", code: "ttukseom", x: 1240, y: 200 },
    { name: "성수", code: "seongsu", x: 1300, y: 200 },
    { name: "건대입구", code: "konkuk", x: 1300, y: 240 },
    { name: "구의", code: "guui", x: 1300, y: 280 },
    { name: "강변", code: "gangbyeon", x: 1300, y: 320 },
    { name: "잠실나루", code: "naru", x: 1300, y: 360 },
    { name: "잠실", code: "jamsil", x: 1300, y: 400 },
    { name: "잠실새내", code: "sinnae", x: 1300, y: 440 },
    { name: "종합운동장", code: "stadium", x: 1300, y: 480 },
    { name: "삼성", code: "samsung", x: 1300, y: 520 },
    { name: "선릉", code: "seolleung", x: 1300, y: 560 },
    { name: "역삼", code: "yeoksam", x: 1240, y: 560 },
    { name: "강남", code: "gangnam", x: 1180, y: 560 },
    { name: "교대", code: "gyodae", x: 1120, y: 560 },
    { name: "서초", code: "seocho", x: 1060, y: 560 },
    { name: "방배", code: "bangbae", x: 1000, y: 560 },
    { name: "사당", code: "sadang", x: 940, y: 560 },
    { name: "낙성대", code: "nakseongdae", x: 880, y: 560 },
    { name: "서울대입구", code: "snu", x: 810, y: 560 },
    { name: "봉천", code: "bongcheon", x: 760, y: 560 },
    { name: "신림", code: "sillim", x: 700, y: 560 },
    { name: "신대방", code: "sindaebang", x: 640, y: 560 },
    { name: "구디", code: "guro", x: 580, y: 560 },
    { name: "대림", code: "daerim", x: 520, y: 560 },
    { name: "신도림", code: "sindorim", x: 460, y: 560 },
    { name: "문래", code: "munrae", x: 460, y: 520 },
    { name: "영등포구청", code: "yeongdeungpo", x: 460, y: 480 },
    { name: "당산", code: "dangsan", x: 460, y: 440 },
    { name: "합정", code: "hapjeong", x: 460, y: 400 },
    { name: "홍대입구", code: "hongdae", x: 460, y: 360 },
    { name: "신촌", code: "sinchon", x: 460, y: 320 },
    { name: "이대", code: "ewha", x: 460, y: 280 },
    { name: "아현", code: "ahyeon", x: 460, y: 240 },
    { name: "충정로", code: "chungjeongno", x: 460, y: 200 },
    { name: "시청", code: "cityhall", x: 530, y: 200 }
  ];

  const seongsuBranch = [
    { name: "성수", code: "seongsu", x: 1300, y: 200 },
    { name: "용답", code: "yongdap", x: 1360, y: 200 },
    { name: "신답", code: "sindap", x: 1420, y: 200 },
    { name: "용두", code: "yongdu", x: 1480, y: 200 },
    { name: "신설동", code: "sinseldong", x: 1540, y: 200 }
  ];

  const sinjeongBranch = [
    { name: "신도림", code: "sindorim", x: 460, y: 560 },
    { name: "도림천", code: "dorimcheon", x: 400, y: 560 },
    { name: "양천구청", code: "yangcheon", x: 340, y: 560 },
    { name: "신정네거리", code: "sinjeong", x: 280, y: 560 },
    { name: "까치산", code: "kachisan", x: 220, y: 560 }
  ];

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
