// src/components/main/Header.jsx
import { useState } from "react";
import { Box, TextField, IconButton } from '@mui/material'; // MUI 컴포넌트 임포트
import SearchIcon from '@mui/icons-material/Search'; // MUI 검색 아이콘 임포트

// 데이터 임포트는 그대로 유지합니다.
import { mainLineStations, seongsuBranch, sinjeongBranch } from "../../data/stationLine2";

export default function Header({ onSearchSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  // 기존 검색 로직은 변경 없이 그대로 사용합니다.
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
      onSearchSelect(matchedStation); // App 상태 업데이트
    } else {
      alert("해당 역을 찾을 수 없어요 😥");
    }
  };

  return (
    <Box
      component="header" // 시맨틱 태그
      sx={{
        bgcolor: 'background.paper', // 테마의 paper 배경색 (다크/라이트 모드 자동 대응)
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`, // 테마의 구분선 색상
        p: { xs: 1.5, sm: 2 }, // 헤더 패딩
        display: 'flex',
        alignItems: 'center',
        gap: 1, // TextField와 IconButton 사이의 간격
        boxShadow: (theme) => theme.shadows[1], // MUI 테마 기본 그림자
      }}
    >
      {/* 왼쪽에 로고나 메뉴 버튼 등이 들어갈 자리 (선택 사항) */}
      {/* <Box sx={{ mr: 2 }}> 로고 </Box> */}

      <TextField
        variant="outlined"
        placeholder="새로운 맛을 찾아 떠나볼까요?"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        sx={{
          flexGrow: 1, // TextField가 가능한 많은 너비를 차지하도록 설정
          maxWidth: '1600px', // 기존 CSS의 max-width
          '& .MuiOutlinedInput-root': { // Outlined TextField의 루트 요소
            borderRadius: '10px', // 기존 border-radius
          },
          '& .MuiInputBase-input': { // 실제 input 요소
            fontSize: '18px', // 기존 font-size
            padding: '14px 20px', // 기존 padding
          },
        }}
      />
      <IconButton
        type="button" // 기본 HTML 버튼 타입 (submit 방지)
        aria-label="search" // 접근성을 위한 라벨
        onClick={handleSearch}
        color="default" // 아이콘 색상을 테마의 action.active 값으로 설정
      >
        <SearchIcon /> {/* 돋보기 아이콘 */}
      </IconButton>

      {/* 오른쪽에 사용자 프로필, 알림 등의 요소가 들어갈 자리 (선택 사항) */}
      {/* <Box sx={{ ml: 'auto' }}> 사용자 메뉴 </Box> */}
    </Box>
  );
}