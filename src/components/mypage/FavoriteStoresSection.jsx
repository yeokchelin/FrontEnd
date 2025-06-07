import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, Typography, Divider, Paper, Box } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function FavoriteStoresSection({ userId }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`/api/users/${userId}/favorites/restaurants`)
      .then(res => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FavoriteIcon color="error" sx={{ mr: 1.5, fontSize: '1.75rem' }} />
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          찜한 가게
        </Typography>
      </Box>
      {loading ? (
        <Typography color="text.secondary">불러오는 중...</Typography>
      ) : favorites.length > 0 ? (
        <List>
          {favorites.map((store, i) => (
            <React.Fragment key={store.id}>
              <ListItem button onClick={() => window.location.href=`/store/${store.id}`}>
                <ListItemText
                  primary={store.name}
                  secondary={store.stationName ? `지하철역: ${store.stationName}` : null}
                />
              </ListItem>
              {i < favorites.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">찜한 가게가 없습니다.</Typography>
      )}
    </Paper>
  );
}
