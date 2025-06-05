// src/components/main/Header.jsx
import React, { useState } from 'react';
import { Box, Paper, TextField, IconButton, Typography } from '@mui/material'; // ToggleButton, ToggleButtonGroup 제거
import SearchIcon from '@mui/icons-material/Search';

import { mainLineStations, seongsuBranch, sinjeongBranch } from "../../data/stationLine2";

// ❗️ onCategoryChange prop 제거
export default function Header({ onSearchSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  // ❗️ selectedCategory 상태 및 관련 로직 제거
  // const [selectedCategory, setSelectedCategory] = useState(null);

  const allStations = [
    ...mainLineStations,
    ...seongsuBranch.slice(1),
    ...sinjeongBranch.slice(1),
  ];

  const handleSearch = (event) => {
    event.preventDefault();
    const cleaned = searchTerm.replace(/역/g, "").replace(/\s/g, "");
    const matchedStation = allStations.find((station) =>
      station.name.replace(/역/g, "").replace(/\s/g, "") === cleaned
    );

    if (matchedStation) {
      onSearchSelect(matchedStation);
    } else {
      alert("해당 역을 찾을 수 없어요 😥");
    }
  };

  // ❗️ handleCategoryChange 함수 제거
  // const handleCategoryChange = (event, newCategory) => { ... };

  // ❗️ foodCategories 배열 제거
  // const foodCategories = [ ... ];

  return (
    // 전체 Box는 유지하되, 하단 카테고리 필터 Box 제거
    <Box sx={{ width: '100%' }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1600px',
          // mb: 1.5, // 🗑️ 카테고리 필터와의 하단 간격 제거 (필요시 다른 값으로 조정)
          borderRadius: '10px',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          {/* <MenuIcon /> */}
        </IconButton>
        <TextField
          variant="standard"
          placeholder="새로운 맛을 찾아 떠나볼까요? (역 이름 검색)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            ml: 1,
            flex: 1,
            '& .MuiInputBase-input': {
              fontSize: { xs: '16px', sm: '18px' },
              padding: { xs: '12px 10px', sm: '14px 10px' },
            },
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* 🗑️ 음식점 카테고리 필터 <Box> 및 <ToggleButtonGroup> 전체 제거 */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}> ... </Box> */}
    </Box>
  );
}