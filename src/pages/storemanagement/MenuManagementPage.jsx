// src/pages/storemanagement/MenuManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Grid, Card, CardMedia,
  CardContent, CardActions, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// 초기 더미 메뉴 데이터
const DUMMY_MENU_ITEMS = [
  { id: 1, name: '시그니처 아메리카노', price: 4800, description: '깊고 풍부한 향의 스페셜티 원두로 만든 아메리카노입니다.', imageUrl: 'https://via.placeholder.com/300x200/607D8B/FFFFFF?Text=Americano' },
  { id: 2, name: '수제 바닐라 라떼', price: 5500, description: '매장에서 직접 만든 바닐라 시럽이 들어간 부드러운 라떼입니다.', imageUrl: 'https://via.placeholder.com/300x200/795548/FFFFFF?Text=VanillaLatte' },
  { id: 3, name: '생딸기 크로플', price: 7500, description: '바삭한 크로플 위에 신선한 생딸기와 크림이 올라갑니다.', imageUrl: 'https://via.placeholder.com/300x200/E91E63/FFFFFF?Text=StrawberryCroffle' },
];

// 메뉴 항목 추가/수정을 위한 폼 다이얼로그 컴포넌트
const MenuItemFormDialog = ({ open, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // 이미지 URL 직접 입력 방식

  useEffect(() => {
    if (open) { // 다이얼로그가 열릴 때마다 초기화 또는 데이터 설정
      if (initialData) {
        setName(initialData.name || '');
        setPrice(initialData.price?.toString() || ''); // 숫자를 문자열로
        setDescription(initialData.description || '');
        setImageUrl(initialData.imageUrl || '');
      } else {
        setName('');
        setPrice('');
        setDescription('');
        setImageUrl('');
      }
    }
  }, [initialData, open]);

  const handleSubmitDialog = () => {
    if (!name.trim() || !price.trim() || !description.trim()) {
      alert('메뉴 이름, 가격, 설명을 모두 입력해주세요.');
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('가격은 0보다 큰 숫자로 입력해주세요.');
      return;
    }

    onSubmit({
      id: initialData?.id, // 수정 시 기존 ID 사용, 추가 시 ID는 부모에서 생성
      name,
      price: priceValue,
      description,
      imageUrl,
    });
    onClose(); // 성공 시 다이얼로그 닫기
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{initialData ? '메뉴 수정' : '새 메뉴 추가'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="menu-name"
          label="메뉴 이름"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          margin="dense"
          id="menu-price"
          label="가격 (숫자만)"
          type="number"
          fullWidth
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ min: 0, step: 100 }} // step: 100 추가
        />
        <TextField
          margin="dense"
          id="menu-description"
          label="메뉴 설명"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="menu-imageUrl"
          label="이미지 URL (선택 사항)"
          type="url"
          fullWidth
          variant="outlined"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="예: https://example.com/image.jpg"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt:1 }}>
        <Button onClick={onClose} color="inherit">취소</Button>
        <Button onClick={handleSubmitDialog} variant="contained" color="primary">
          {initialData ? '수정 완료' : '추가하기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 메뉴 관리 페이지 메인 컴포넌트
export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState(DUMMY_MENU_ITEMS);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null); // 수정할 메뉴 항목 데이터

  const handleOpenFormDialog = (item = null) => {
    setEditingMenuItem(item); // null이면 새 항목 추가, item 객체가 있으면 해당 항목 수정
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setEditingMenuItem(null); // 다이얼로그 닫을 때 수정 중이던 항목 정보 초기화
  };

  const handleSaveMenuItem = (itemData) => {
    setMenuItems(prevItems => {
      if (editingMenuItem && itemData.id) { // ID가 있는 경우 (수정)
        return prevItems.map(item => (item.id === itemData.id ? { ...item, ...itemData } : item));
      } else { // 새 항목 추가
        return [{ ...itemData, id: Date.now() }, ...prevItems]; // 새 ID 부여
      }
    });
    // 여기에 실제 API 호출 로직 추가 (항목 추가 또는 업데이트)
    console.log("저장된/수정된 메뉴:", itemData);
    // handleCloseFormDialog(); // onSubmit에서 이미 onClose를 호출하므로 중복 X
  };

  const handleDeleteMenuItem = (itemId) => {
    if (window.confirm('정말로 이 메뉴 항목을 삭제하시겠습니까?')) {
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
      // 여기에 실제 API 호출 로직 추가 (항목 삭제)
      console.log("삭제된 메뉴 ID:", itemId);
    }
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3 } /* 페이지 상하 패딩 */ }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
          메뉴 목록 관리
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => handleOpenFormDialog()} // 새 항목 추가이므로 인자 없이 호출
        >
          새 메뉴 추가
        </Button>
      </Box>

      {menuItems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }}>
          <Typography color="text.secondary">
            등록된 메뉴가 없습니다. '새 메뉴 추가' 버튼을 눌러 첫 메뉴를 등록해주세요.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}> {/* 반응형 그리드 */}
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2.5 }}>
                <CardMedia
                  component="img"
                  height="180" // 이미지 높이
                  image={item.imageUrl || "https://via.placeholder.com/300x200/E0E0E0/BDBDBD?Text=No+Image"}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 1 }}> {/* 내용이 적을 때도 카드 높이 유지 */}
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: '3.6em' /* 약 3줄 높이 */, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {item.price.toLocaleString()}원
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1, px: 1 }}>
                  <IconButton size="small" onClick={() => handleOpenFormDialog(item)} aria-label={`메뉴 ${item.name} 수정`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteMenuItem(item.id)} aria-label={`메뉴 ${item.name} 삭제`}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 메뉴 추가/수정 폼 다이얼로그 */}
      <MenuItemFormDialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        onSubmit={handleSaveMenuItem}
        initialData={editingMenuItem} // 수정 시 기존 데이터 전달, 추가 시 null
      />
    </Box>
  );
}