// src/components/main/StationInfo.jsx
import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function StationInfo({ station, restaurants }) {
  if (!station) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        width: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{ color: 'text.primary' }}
      >
        {station.name}역 근처 음식점
      </Typography>

      {restaurants && restaurants.length > 0 ? (
        <List disablePadding>
          {restaurants.map((restaurant, idx) => (
            <React.Fragment key={restaurant.id || idx}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                {restaurant.imageUrl && (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    width="100"
                    height="100"
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {restaurant.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        카테고리: {restaurant.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        평점: {restaurant.rating}점 ({restaurant.reviewCount}개 리뷰)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        역: {restaurant.stationName}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {idx < restaurants.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
          주변 음식점 정보가 없습니다. 😥
        </Typography>
      )}
    </Paper>
  );
}
