import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, List, ListItem, ListItemText, Button, Divider, ListItemIcon
} from "@mui/material";
import RateReviewIcon from '@mui/icons-material/RateReview';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArticleIcon from '@mui/icons-material/Article';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import MyActivityModal from "../../components/mypage/MyActivityModal"; // 경로 맞게 수정

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
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [myMatePosts, setMyMatePosts] = useState([]);
  const [myFreePosts, setMyFreePosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userLevel, setUserLevel] = useState("일반 회원");
  const [hasStores, setHasStores] = useState(false);

  // 모달 관련 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("currentUserId");
    setUserId(id);

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
    } catch (e) {}
    setUserLevel(currentLevel);
    setHasStores(storesExist);

    const fav = localStorage.getItem('userFavorites');
    if (fav) {
      setFavorites(JSON.parse(fav));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios.get(`/api/reviews/user/${userId}`)
      .then(res => setMyReviews(res.data || []))
      .catch(() => setMyReviews([]));
    axios.get(`/api/boardmatefood/user/${userId}`)
      .then(res => {
        console.log('밥친구 데이터:', res.data);
        setMyMatePosts(res.data || [])
      })
      .catch(() => setMyMatePosts([]));
    axios.get(`/api/freeboard/user/${userId}`)
      .then(res => {
          console.log('자유게시판 데이터:', res.data);
         setMyFreePosts(res.data || [])
        })
      .catch(() => setMyFreePosts([]));
  }, [userId]);

  const handleManageStore = () => setView("manageStore");

  // 🔥 활동 내역 클릭 시 모달 띄우기
  const handleGoToDetail = (type, data) => {
    setSelectedItem({ type, data });
    setModalOpen(true);
  };

  const getPreviewText = (text) => {
    if (!text) return "";
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  };

  // 🔥 반드시 data: r/p/f로 원본데이터를 넣어준다!
  const myActivities = [
    ...myReviews.map(r => ({
      id: r.id,
      type: '리뷰',
      icon: <RateReviewIcon />,
      title: r.place || r.restaurantName || "리뷰",
      content: getPreviewText(r.content),
      data: r,
    })),
    ...myMatePosts.map(p => ({
      id: p.id,
      type: '밥친구',
      icon: <RestaurantIcon />,
      title: p.title,
      content: getPreviewText(p.content),
      data: p,
    })),
    ...myFreePosts.map(f => ({
      id: f.id,
      type: '자유게시판',
      icon: <ArticleIcon />,
      title: f.title,
      content: getPreviewText(f.content),
      data: f,
    }))
  ];

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

      {/* 나의 활동 내역 */}
      <Box sx={{
        width: '100%',
        maxWidth: 'lg',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 3, md: 3 }
      }}>
        <Box sx={{ flex: 1 }}>
          <SectionPaper title="나의 활동 내역" icon={<RateReviewIcon />}>
            {myActivities.length > 0 ? (
              <List disablePadding>
                {myActivities.map((act, index) => (
                  <React.Fragment key={act.type + act.id}>
                    <ListItem
                      button
                      sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start', cursor: "pointer" }}
                      onClick={() => handleGoToDetail(act.type, act.data)}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>{act.icon}</ListItemIcon>
                        <Typography component="strong" sx={{ fontWeight: 'medium', color: 'text.primary', ml: 0.5 }}>{act.title}</Typography>
                        <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>{act.type}</Typography>
                      </Box>
                      <ListItemText secondary={act.content} sx={{ mt: 0.5 }} />
                    </ListItem>
                    {index < myActivities.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">아직 활동 내역이 없습니다.</Typography>
            )}
          </SectionPaper>
        </Box>

        {/* 찜한 가게(더미 데이터 그대로) */}
        <Box sx={{ flex: 1 }}>
          <SectionPaper title="찜한 가게" icon={<FavoriteIcon />}>
            {favorites.length > 0 ? (
              <List disablePadding>
                {favorites.map((fav, index) => (
                  <React.Fragment key={fav.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText primary={fav.name} />
                    </ListItem>
                    {index < favorites.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">찜한 가게가 없습니다.</Typography>
            )}
          </SectionPaper>
        </Box>
      </Box>

      {/* 회원등급/내 가게 관리 */}
      <Box sx={{
        width: '100%',
        maxWidth: 'lg',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 3 }, mt: 1,
      }}>
        <Box sx={{ flex: { sm: 1 } }}>
          <SectionPaper title="회원 등급" icon={<AdminPanelSettingsIcon />}>
            <Typography variant="h6" sx={{ color: userLevel === "점주 회원" ? 'primary.main' : 'text.secondary', fontWeight: 'bold' }}>
              {userLevel}
            </Typography>
          </SectionPaper>
        </Box>
        {hasStores && (
          <Button variant="contained" color="primary" size="large" onClick={handleManageStore} startIcon={<StorefrontIcon />}
            sx={{ py: 1.5, fontWeight: 'bold', width: { xs: '100%', sm: 'auto' } }}>
            내 가게 관리
          </Button>
        )}
      </Box>

      {/* 팝업 상세 모달 */}
      <MyActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
      />
    </Box>
  );
}