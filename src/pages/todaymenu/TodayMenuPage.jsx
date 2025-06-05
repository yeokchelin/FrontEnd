import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const categories = ['전체', '한식', '중식', '일식', '양식', '카페디저트', '기타'];
const COLORS = ['#33b5e5', '#009966', '#ffbb33', '#ff4444', '#aa66cc', '#ff8800', '#00C851'];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function getArcPath(cx, cy, r, startAngle, endAngle) {
  const rad = Math.PI / 180;
  const x1 = cx + r * Math.cos(rad * startAngle);
  const y1 = cy + r * Math.sin(rad * startAngle);
  const x2 = cx + r * Math.cos(rad * endAngle);
  const y2 = cy + r * Math.sin(rad * endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    "Z"
  ].join(" ");
}
function getTextPosition(cx, cy, r, angle) {
  const rad = (angle - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function TodayMenuPage() {
  const [spinning, setSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [totalRotate, setTotalRotate] = useState(0);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);

  // 룰렛 돌리기
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setMenu(null);

    const n = categories.length;
    const slice = 360 / n;
    const extraSpins = 3 + getRandomInt(2);
    const target = getRandomInt(n);

    // target 조각의 중앙이 포인터(12시)로 오도록
    const targetCenterDeg = 360 - (target * slice + slice / 2);
    const nextRotate = totalRotate + extraSpins * 360 + targetCenterDeg;
    setTotalRotate(nextRotate);

    setTimeout(async () => {
      setSpinning(false);

      // 실제 멈춘 각도 기준으로 조각 인덱스 구하기
      const normalized = ((nextRotate % 360) + 360) % 360;
      let index = Math.round((360 - normalized - slice / 2) / slice) % n;
      if (index < 0) index += n;

      setSelectedIndex(index);

      // 메뉴 추천 API 호출
      setLoading(true);
      try {
        const res = await axios.get(`/api/today-menu/random?category=${encodeURIComponent(categories[index])}`);
        setMenu(res.data);
      } catch (err) {
        setMenu(null);
      }
      setLoading(false);
    }, 2600);
  };

  // SVG 룰렛 그리기 파트
  const size = 320;
  const r = size / 2;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Box sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>카테고리 룰렛</Typography>
      <Box sx={{
        position: "relative",
        width: size + 24,
        height: size + 24,
        mb: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#d32f2f",
        borderRadius: "50%",
        boxShadow: "0 6px 18px #0004",
      }}>
        <svg
          width={size}
          height={size}
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            borderRadius: "50%",
            background: "#d32f2f",
            transition: spinning ? "transform 2.5s cubic-bezier(0.25,1.1,0.29,1)" : "none",
            transform: `rotate(${totalRotate}deg)`,
            display: "block",
            zIndex: 2,
          }}
        >
          {categories.map((cat, i) => {
            const n = categories.length;
            const slice = 360 / n;
            const start = slice * i;
            const end = start + slice;
            const mid = start + slice / 2;
            const { x, y } = getTextPosition(cx, cy, r * 0.7, mid);
            return (
              <g key={cat}>
                <path
                  d={getArcPath(cx, cy, r, start - 90, end - 90)}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#d32f2f"
                  strokeWidth="0.5"
                />
                <text
                  x={x}
                  y={y}
                  fill="#fff"
                  fontSize="1.24rem"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${mid} ${x} ${y})`}
                  style={{
                    textShadow: "1px 2px 8px #000b",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {cat}
                </text>
              </g>
            );
          })}
        </svg>
        {/* 중앙 버튼/포인터/거치대 */}
        <Box sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 76,
          height: 76,
          bgcolor: "gold",
          border: "8px solid #f9b600",
          borderRadius: "50%",
          boxShadow: "0 0 15px #ffed87, 0 4px 18px #0004",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Box sx={{
            width: 36,
            height: 36,
            bgcolor: "#ffd800",
            borderRadius: "50%",
            border: "4px solid #f8c700",
            boxShadow: "0 2px 6px #0002",
          }} />
        </Box>
        <Box sx={{
          position: "absolute",
          left: "50%",
          top: -36,
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "33px solid transparent",
          borderRight: "33px solid transparent",
          borderBottom: "58px solid #f9b600",
          zIndex: 11,
          filter: "drop-shadow(0px 4px 2px #e09100a8)"
        }} />
      </Box>
      <Box sx={{
        position: "relative",
        width: size * 0.75,
        height: 62,
        mt: "-28px",
        background: "#d32f2f",
        borderTopLeftRadius: 64,
        borderTopRightRadius: 64,
        zIndex: 0,
      }} />
      <Button
        variant="contained"
        color="success"
        size="large"
        disabled={spinning}
        onClick={handleSpin}
        sx={{ mt: 2, fontWeight: "bold", width: 170 }}
      >
        {spinning ? "돌리는 중..." : "룰렛 돌리기"}
      </Button>

      {/* 선택된 카테고리 */}
      {selectedIndex !== null && !spinning && (
        <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
          선택된 카테고리: {categories[selectedIndex]}
        </Typography>
      )}
      {/* 메뉴 추천 결과 */}
      {loading && <CircularProgress sx={{ my: 4 }} />}
      {menu && (
        <Box sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 4, bgcolor: "background.paper", textAlign: "center", minWidth: 340 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, color: "success.main"}}>{menu.name}</Typography>
          <Typography variant="body1" sx={{ color: "text.primary" }}>{menu.description}</Typography>
          {menu.imageUrl && (
            <img
              src={menu.imageUrl}
              alt={menu.name}
              style={{ marginTop: 16, borderRadius: 16, width: "75%", maxWidth: 320, minHeight: 140, objectFit: "cover" }}
            />
          )}
        </Box>
      )}
      {!loading && selectedIndex !== null && !menu && (
        <Typography color="error" sx={{ mt: 2 }}>추천할 메뉴가 없습니다.</Typography>
      )}
    </Box>
  );
}
