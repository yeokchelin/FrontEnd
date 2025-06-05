import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Box, CircularProgress } from '@mui/material';

const TodayMenuPage = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/today-menu')
      .then(res => setMenu(res.data))
      .catch(() => setMenu(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
    <CircularProgress />
    <Typography sx={{ ml: 2 }}>오늘의 메뉴를 추천 중...</Typography>
  </Box>;

  if (!menu) return <Box sx={{ textAlign: 'center', p: 4 }}>
    <Typography color="error" variant="h6">추천할 메뉴가 없습니다.</Typography>
  </Box>;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>오늘의 메뉴 추천</Typography>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardMedia
          component="img"
          height="220"
          image={menu.imageUrl || "https://via.placeholder.com/400x220?text=No+Image"}
          alt={menu.name}
        />
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{menu.name}</Typography>
          <Typography variant="body1" color="text.secondary">{menu.description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TodayMenuPage;