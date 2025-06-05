// src/components/main/Sidebar.jsx
import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useTheme,
} from "@mui/material";

// ❗️ 여기를 수정했습니다: jwt-decode 라이브러리를 이름 내보내기 방식으로 임포트합니다.
import { jwtDecode } from "jwt-decode";

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ForumIcon from '@mui/icons-material/Forum';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
// import RateReviewIcon from '@mui/icons-material/RateReview'; // 리뷰 게시판 아이콘 (기존에 제거됨)
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import logo from "../../assets/Logo.png";

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

export default function SideBar({ setView }) {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);

  // isJwtValid 함수는 이제 jwtDecode를 올바르게 임포트했으므로 정상 작동할 것입니다.
  function isJwtValid(token) {
    try {
      if (!token) return false;
      const decodedToken = jwtDecode(token); // jwt-decode 라이브러리 사용
      const now = Math.floor(Date.now() / 1000);
      return decodedToken.exp && decodedToken.exp > now;
    } catch (err) {
      console.error("JWT decode error:", err);
      return false;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token && isJwtValid(token)) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
    }
  }, []); // isJwtValid 함수는 useEffect 밖에서 정의되었으므로 의존성 배열에 포함하지 않습니다.

  const redirectToKakaoLogin = () => {
    const CLIENT_ID = "7113cca2b7bef1a368f5c1a7bc637d82";
    const REDIRECT_URI = "http://localhost:8080/api/auth/kakao";
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setView("map"); // 로그아웃 후 기본 뷰로 이동
  };

  const handleBoardClick = () => {
    setBoardOpen(!boardOpen);
  };

  const commonListItemButtonStyles = {
    py: collapsed ? 1.5 : 1,
    px: collapsed
      ? (theme) => theme.spacing((collapsedDrawerWidth - (24 + 16)) / 2 / 8)
      : 2.5,
    minHeight: 48,
    justifyContent: collapsed ? "center" : "flex-start",
    "& .MuiListItemIcon-root": {
      minWidth: 0,
      mr: collapsed ? 0 : 1.5,
      justifyContent: "center",
    },
  };

  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        bgcolor: "background.paper",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
      }}
    >
      {/* 접기 버튼 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-end",
          p: 1,
          minHeight: "64px",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* 로고 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          cursor: "pointer",
        }}
        onClick={() => setView("map")}
      >
        <img
          src={logo}
          alt="로고"
          style={{
            width: collapsed ? "32px" : "80%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      <Divider />

      {/* 메뉴 */}
      <List component="nav" sx={{ flexGrow: 1, overflowY: "auto", p: collapsed ? 0 : 1 }}>
        {!isLoggedIn ? (
          <ListItemButton sx={commonListItemButtonStyles} onClick={redirectToKakaoLogin}>
            <ListItemIcon><LoginIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="로그인" />}
          </ListItemButton>
        ) : (
          <ListItemButton sx={commonListItemButtonStyles} onClick={() => setView("mypage")}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="마이페이지" />}
          </ListItemButton>
        )}

        <Divider sx={{ my: 1 }} />

        {/* 게시판 */}
        <ListItemButton sx={commonListItemButtonStyles} onClick={handleBoardClick}>
          <ListItemIcon><ArticleIcon /></ListItemIcon>
          {!collapsed && <ListItemText primary="게시판" />}
          {!collapsed && (boardOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        {!collapsed && (
          <Collapse in={boardOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {[
                { text: "투표게시판", view: "vote", icon: <HowToVoteIcon fontSize="small" /> },
                { text: "자유게시판", view: "free", icon: <ForumIcon fontSize="small" /> },
                { text: "밥친구 구하기", view: "mate", icon: <RestaurantMenuIcon fontSize="small" /> },
                // ❗️ 제거: 리뷰 게시판 항목 (기존에 제거됨)
                // { text: "리뷰 게시판", view: "review", icon: <RateReviewIcon fontSize="small" /> },
              ].map((item) => (
                <ListItemButton
                  key={item.text}
                  sx={{ ...commonListItemButtonStyles, py: 0.5 }}
                  onClick={() => setView(item.view)}
                >
                  <ListItemIcon sx={{ minWidth: '32px' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}

        {/* 회원등급 변경 */}
        {isLoggedIn && (
          <ListItemButton sx={commonListItemButtonStyles} onClick={() => setView("changeGrade")}>
            <ListItemIcon><StarBorderIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="회원등급 변경하기" />}
          </ListItemButton>
        )}
      </List>

      {/* 로그아웃 */}
      {isLoggedIn && (
        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ mb: 1 }} />
          <ListItemButton sx={commonListItemButtonStyles} onClick={handleLogout}>
            <ListItemIcon><LogoutIcon sx={{ color: theme.palette.error.main }} /></ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="로그아웃"
                primaryTypographyProps={{ color: theme.palette.error.main }}
              />
            )}
          </ListItemButton>
        </Box>
      )}
    </Box>
  );
}