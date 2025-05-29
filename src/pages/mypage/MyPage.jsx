// src/pages/Mypage.jsx
import React, { useEffect, useState } from "react"; // React 임포트 추가!
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, Divider, ListItemIcon } from "@mui/material";
import RateReviewIcon from '@mui/icons-material/RateReview';     // 리뷰 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite';       // 찜 아이콘
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // 회원 등급 아이콘
import StorefrontIcon from '@mui/icons-material/Storefront';     // 가게 관리 아이콘
// import styles from "./Mypage.module.css"; // 더 이상 필요 없습니다.

// 각 섹션을 감싸는 Paper 스타일을 위한 헬퍼 컴포넌트
const SectionPaper = ({ title, icon, children }) => (
  <Paper
    elevation={2} // 그림자 효과
    sx={{
      p: { xs: 2, sm: 3 }, // 내부 패딩
      width: '100%',        // 부모 너비에 맞춤
      bgcolor: 'background.paper',
      borderRadius: 2,      // 모서리 둥글기
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
  const [userLevel, setUserLevel] = useState("");

  useEffect(() => {
    // 더미 데이터 초기화
    setReviews([
      { id: 1, place: "강남 맛집", content: "진짜 맛있었어요! 다음에도 방문할 예정입니다." },
      { id: 2, place: "홍대 유명 카페", content: "분위기도 좋고 커피 맛도 일품이었어요." },
    ]);
    setFavorites([
      { id: 1, name: "이태원 파스타 전문점" },
      { id: 2, name: "한남동 디저트 맛집" },
    ]);
    setUserLevel("우수 점주"); // 예시: 사용자 등급
  }, []);

  const handleManageStore = () => {
    setView("manageStore"); // StoreManagementPage로 뷰 변경
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3, md: 4 }, // 페이지 전체의 상하 패딩
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // 페이지 내 주요 콘텐츠 블록들을 중앙 정렬
        gap: { xs: 3, sm: 4 },   // 제목과 각 섹션 사이의 간격
      }}
    >
      <Typography
        variant="h4" // 페이지 제목
        component="h1"
        sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'bold' }}
      >
        마이페이지
      </Typography>

      {/* 리뷰 및 찜한 가게 섹션을 가로로 배치 (중간 크기 이상 화면) */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 'lg', // 전체 콘텐츠 영역의 최대 너비를 lg 브레이크포인트(1200px)로 제한
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // 작은 화면에서는 세로, md 이상에서는 가로 배치
          gap: { xs: 3, md: 3 }, // 섹션 간 간격
        }}
      >
        {/* 나의 리뷰 섹션 */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <SectionPaper title="나의 활동 내역" icon={<RateReviewIcon />}>
            {reviews.length > 0 ? (
              <List disablePadding>
                {reviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    <ListItem sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography component="strong" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                        {review.place}
                      </Typography>
                      <ListItemText secondary={review.content} sx={{mt: 0.5}} />
                    </ListItem>
                    {index < reviews.length - 1 && <Divider component="li" sx={{my: 1}} />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">작성한 리뷰가 없습니다.</Typography>
            )}
          </SectionPaper>
        </Box>

        {/* 찜한 가게 섹션 */}
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
            ) : (
              <Typography variant="body2" color="text.secondary">찜한 가게가 없습니다.</Typography>
            )}
          </SectionPaper>
        </Box>
      </Box>

      {/* 회원 등급 및 가게 관리 버튼 섹션 */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 'lg', // 위쪽 섹션과 동일한 최대 너비
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // 작은 화면에서는 세로, sm 이상에서는 가로 배치
          justifyContent: 'space-between', // 가로 배치 시 양쪽 끝으로
          alignItems: { xs: 'stretch', sm: 'center' }, // 가로 배치 시 수직 중앙, 세로 배치 시 버튼 늘림
          gap: { xs: 2, sm: 3 },
          mt: 1, // 위 섹션과의 간격
        }}
      >
        <Box sx={{ flex: {sm: 1} }}> {/* 회원 등급이 버튼보다 많은 공간을 차지하도록 (선택 사항) */}
          <SectionPaper title="회원 등급" icon={<AdminPanelSettingsIcon />}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {userLevel} 회원
            </Typography>
          </SectionPaper>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleManageStore}
          startIcon={<StorefrontIcon />}
          sx={{
            py: 1.5, // 버튼의 상하 패딩을 늘려 더 커 보이게
            fontWeight: 'bold',
            width: { xs: '100%', sm: 'auto' }, // 작은 화면에서는 전체 너비
          }}
        >
          내 가게 관리
        </Button>
      </Box>
    </Box>
  );
}