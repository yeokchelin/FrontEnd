// src/pages/Mypage.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, Divider, ListItemIcon } from "@mui/material";
import RateReviewIcon from '@mui/icons-material/RateReview';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';

const SectionPaper = ({ title, icon, children }) => (
  <Paper
    elevation={2}
    sx={{
      p: { xs: 2, sm: 3 },
      width: '100%',
      bgcolor: 'background.paper',
      borderRadius: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon && React.cloneElement(icon, { sx: { mr: 1.5, color: 'primary.main', fontSize: '1.75rem' } })}
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

export default function Mypage({ setView }) {
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userLevel, setUserLevel] = useState("일반 회원"); // 초기값
  const [hasStores, setHasStores] = useState(false);

  useEffect(() => {
    setReviews([
      { id: 1, place: "강남 맛집", content: "진짜 맛있었어요! 다음에도 방문할 예정입니다." },
      { id: 2, place: "홍대 유명 카페", content: "분위기도 좋고 커피 맛도 일품이었어요." },
    ]);
    setFavorites([
      { id: 1, name: "이태원 파스타 전문점" },
      { id: 2, name: "한남동 디저트 맛집" },
    ]);

    let currentLevel = "일반 회원";
    let storesExist = false;
    try {
      const savedStoresData = localStorage.getItem('userRegisteredStores');
      if (savedStoresData) {
        const registeredStores = JSON.parse(savedStoresData);
        if (Array.isArray(registeredStores) && registeredStores.length > 0) {
          currentLevel = "점주 회원";
          storesExist = true;
        }
      }
    } catch (e) {
      console.error("Mypage: 로컬 스토리지 로딩/파싱 실패", e);
      // currentLevel과 storesExist는 기본값 유지
    }
    setUserLevel(currentLevel);
    setHasStores(storesExist);
  }, []); // 마운트 시 한 번만 실행

  const handleManageStore = () => {
    setView("manageStore");
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 4 },
      }}
    >
      <Typography variant="h4" component="h1" sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'bold' }}>
        마이페이지
      </Typography>

      <Box /* 리뷰 및 찜한 가게 섹션 */ sx={{ width: '100%', maxWidth: 'lg', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 3 } }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <SectionPaper title="나의 활동 내역" icon={<RateReviewIcon />}>
            {reviews.length > 0 ? (
              <List disablePadding>
                {reviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    <ListItem sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography component="strong" sx={{ fontWeight: 'medium', color: 'text.primary' }}>{review.place}</Typography>
                      <ListItemText secondary={review.content} sx={{mt: 0.5}} />
                    </ListItem>
                    {index < reviews.length - 1 && <Divider component="li" sx={{my: 1}} />}
                  </React.Fragment>
                ))}
              </List>
            ) : ( <Typography variant="body2" color="text.secondary">작성한 리뷰가 없습니다.</Typography> )}
          </SectionPaper>
        </Box>
        <Box sx={{ flex: 1, width: '100%' }}>
          <SectionPaper title="찜한 가게" icon={<FavoriteIcon />}>
            {favorites.length > 0 ? (
              <List disablePadding>
                {favorites.map((fav, index) => (
                  <React.Fragment key={fav.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText primary={fav.name} />
                    </ListItem>
                    {index < favorites.length - 1 && <Divider component="li" sx={{my: 1}}/>}
                  </React.Fragment>
                ))}
              </List>
            ) : ( <Typography variant="body2" color="text.secondary">찜한 가게가 없습니다.</Typography> )}
          </SectionPaper>
        </Box>
      </Box>

      <Box /* 회원 등급 및 가게 관리 버튼 섹션 */ sx={{ width: '100%', maxWidth: 'lg', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: { xs: 2, sm: 3 }, mt: 1, }}>
        <Box sx={{ flex: {sm: 1} }}>
          <SectionPaper title="회원 등급" icon={<AdminPanelSettingsIcon />}>
            <Typography variant="h6" sx={{ color: userLevel === "점주 회원" ? 'primary.main' : 'text.secondary', fontWeight: 'bold' }}>
              {userLevel}
            </Typography>
          </SectionPaper>
        </Box>
        {hasStores && (
          <Button variant="contained" color="primary" size="large" onClick={handleManageStore} startIcon={<StorefrontIcon />} sx={{ py: 1.5, fontWeight: 'bold', width: { xs: '100%', sm: 'auto' } }}>
            내 가게 관리
          </Button>
        )}
      </Box>
    </Box>
  );
}