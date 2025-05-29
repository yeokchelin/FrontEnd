// src/components/main/Sidebar.jsx
import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  // Button, // ListItemButton으로 대체되었으므로 직접 사용 안 함
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  // Avatar, // 현재 코드에서 Avatar는 사용되지 않고 있음
  useTheme
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArticleIcon from '@mui/icons-material/Article';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ForumIcon from '@mui/icons-material/Forum';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import logo from "../../assets/Logo.png"; // 로고 이미지 경로
// import RegisterModal from "./Register"; // RegisterModal 임포트 삭제
import { kakaoLogin } from "../../utils/KakaoLogin";

const drawerWidth = 240; // 펼쳐졌을 때 사이드바 너비
const collapsedDrawerWidth = 60; // 접혔을 때 사이드바 너비 (아이콘만 보이도록)

export default function SideBar({ setView }) {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  // const [showRegister, setShowRegister] = useState(false); // showRegister 상태 삭제
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    kakaoLogin()
      .then(() => setIsLoggedIn(true))
      .catch((err) => console.error("로그인 실패:", err));
  };

  const handleLogout = () => {
    const kakao = window.Kakao;
    if (kakao?.Auth?.getAccessToken()) {
      kakao.Auth.logout(() => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setView("map");
      });
    } else {
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      setView("map");
    }
  };

  const handleBoardClick = () => {
    setBoardOpen(!boardOpen);
  };

  const commonListItemButtonStyles = {
    py: collapsed ? 1.5 : 1,
    px: collapsed ? (theme) => theme.spacing( (collapsedDrawerWidth - (24 + 16)) / 2 / 8 ) : 2.5,
    minHeight: 48,
    justifyContent: collapsed ? 'center' : 'flex-start',
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      mr: collapsed ? 0 : 1.5,
      justifyContent: 'center',
    },
  };

  return (
    <> {/* 최상위 Fragment 유지 */}
      <Box
        component="aside"
        sx={{
          width: collapsed ? collapsedDrawerWidth : drawerWidth,
          flexShrink: 0,
          bgcolor: 'background.paper',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        }}
      >
        {/* 토글 버튼 영역 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            p: 1,
            minHeight: '64px',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}>
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        {/* 로고 영역 */}
        {!collapsed && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, cursor: 'pointer' }}
            onClick={() => setView("map")}
          >
            <img src={logo} alt="로고" style={{ width: '80%', height: 'auto', objectFit: 'contain' }} />
          </Box>
        )}
        {collapsed && (
           <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2, cursor: 'pointer' }}
            onClick={() => setView("map")}
          >
            <img src={logo} alt="로고 축소" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          </Box>
        )}

        <Divider />

        {/* 메뉴 리스트 */}
        <List component="nav" sx={{ flexGrow: 1, overflowY: 'auto', p: collapsed ? 0: 1 }}>
          {!isLoggedIn ? (
            <ListItemButton sx={commonListItemButtonStyles} onClick={handleLogin}>
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

          <ListItemButton sx={commonListItemButtonStyles} onClick={handleBoardClick}>
            <ListItemIcon><ArticleIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="게시판" />}
            {!collapsed && (boardOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          {!collapsed && (
            <Collapse in={boardOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {[
                  { text: "투표게시판", view: "vote", icon: <HowToVoteIcon fontSize="small"/> },
                  { text: "자유게시판", view: "free", icon: <ForumIcon fontSize="small"/> },
                  { text: "밥친구 구하기", view: "mate", icon: <RestaurantMenuIcon fontSize="small"/> },
                  { text: "리뷰 게시판", view: "review", icon: <RateReviewIcon fontSize="small"/> },
                ].map((item) => (
                  <ListItemButton key={item.text} sx={{ ...commonListItemButtonStyles, py:0.5 }} onClick={() => setView(item.view)}>
                    <ListItemIcon sx={{minWidth: '32px'}}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{fontSize: '0.9rem'}}/>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}

          {isLoggedIn && (
            <>
              <ListItemButton sx={commonListItemButtonStyles} onClick={() => setView("favorites")}>
                <ListItemIcon><StarBorderIcon /></ListItemIcon>
                {!collapsed && <ListItemText primary="회원등급 변경하기" />}
              </ListItemButton>
            </>
          )}
        </List>

        {isLoggedIn && (
          <Box sx={{ mt: 'auto' }}>
            <Divider sx={{ mb: 1 }}/>
            <ListItemButton sx={commonListItemButtonStyles} onClick={handleLogout}>
              <ListItemIcon><LogoutIcon sx={{ color: theme.palette.error.main }} /></ListItemIcon>
              {!collapsed && <ListItemText primary="로그아웃" primaryTypographyProps={{ color: theme.palette.error.main }}/>}
            </ListItemButton>
          </Box>
        )}
      </Box>

      {/* {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />} // RegisterModal 렌더링 부분 삭제 */}
    </>
  );
}