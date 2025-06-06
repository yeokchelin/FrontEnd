import React from "react";
import { Box, Typography, Divider, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MyActivityModal({ open, onClose, item }) {
  if (!item || !item.data) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="activity-modal-title">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: '90%', md: '700px' },
        maxHeight: '90vh', overflowY: 'auto',
        bgcolor: 'background.paper', boxShadow: 24, p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2, outline: 'none',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="activity-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
            {item.data.title || item.data.restaurantName || '상세 보기'}
          </Typography>
          <IconButton onClick={onClose} aria-label="닫기"><CloseIcon /></IconButton>
        </Box>
        {/* 타입별 상세 */}
        {item.type === "리뷰" && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
              평점: {item.data.rating || "-"} / 작성일: {item.data.createdAt && new Date(item.data.createdAt).toLocaleDateString()}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {item.data.content}
            </Typography>
          </>
        )}
        {item.type === "자유게시판" && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
              작성자: {item.data.writer} / {item.data.createdAt && new Date(item.data.createdAt).toLocaleDateString()}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {item.data.content}
            </Typography>
          </>
        )}
        {item.type === "밥친구" && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
              만남장소: {item.data.meetingStation} / 인원: {item.data.recruitCount}명
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {item.data.content}
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
}
