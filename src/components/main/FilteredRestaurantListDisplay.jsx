import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const FilteredRestaurantListDisplay = ({
  stationName,
  category,
  restaurants,
  isLoading,
  error,
  onRestaurantSelect,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>음식점 목록을 불러오는 중입니다...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        음식점 정보를 불러오는 중 오류가 발생했습니다: {typeof error === 'string' ? error : error.message}
      </Alert>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, mt: 2, textAlign: 'center' }}>
        <RestaurantIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          <strong>{stationName}</strong>역 근처 '<strong>{category}</strong>' 카테고리에는
          <br />표시할 음식점이 없습니다. 😥
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333' : '#e3f2fd',
          color: (theme) => theme.palette.getContrastText(theme.palette.mode === 'dark' ? '#333' : '#e3f2fd'),
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="h3">
          {stationName}역 - {category} 추천
        </Typography>
      </Box>

      <List disablePadding>
        {restaurants.map((restaurant, index) => (
          <React.Fragment key={restaurant.id || `filtered-resto-${index}`}>
            <ListItemButton
              onClick={() => onRestaurantSelect(restaurant)}
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                {restaurant.imageUrl ? (
                  <Box
                    component="img"
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
                  />
                ) : (
                  <RestaurantIcon color="action" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                    {restaurant.name || "이름 없음"}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {restaurant.address || restaurant.description?.substring(0, 50) + (restaurant.description?.length > 50 ? '...' : '') || "정보 없음"}
                  </Typography>
                }
              />
            </ListItemButton>
            {index < restaurants.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default FilteredRestaurantListDisplay;