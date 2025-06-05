// src/constants/categoryConstants.jsx
import React from 'react';
// 필요한 MUI 아이콘들을 임포트합니다.
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StorefrontIcon from '@mui/icons-material/Storefront'; // 👈 "기타" 카테고리용 아이콘 추가

export const CATEGORY_DEFINITIONS = [
  { value: "전체", label: "전체", icon: <AllInclusiveIcon fontSize="small" />, isFilterOnly: true },
  { value: "한식", label: "한식", icon: <RiceBowlIcon fontSize="small" /> },
  { value: "중식", label: "중식", icon: <RamenDiningIcon fontSize="small" /> },
  { value: "일식", label: "일식", icon: <RamenDiningIcon fontSize="small" /> },
  { value: "양식", label: "양식", icon: <FastfoodIcon fontSize="small" /> },
  { value: "카페디저트", label: "카페·디저트", icon: <LocalCafeIcon fontSize="small" /> },
  { value: "기타", label: "기타", icon: <StorefrontIcon fontSize="small" /> }, // 👈 "기타" 카테고리 추가
];

export const getCategoryDisplayInfo = (categoryValue) => {
  const foundCategory = CATEGORY_DEFINITIONS.find(cat => cat.value === categoryValue);
  if (foundCategory) {
    // isFilterOnly가 true인 "전체" 카테고리는 보통 식당의 실제 카테고리가 아니므로,
    // getCategoryDisplayInfo에서는 "전체"를 찾더라도 기본값으로 처리하거나,
    // 호출하는 쪽에서 "전체"를 어떻게 다룰지 결정할 수 있습니다.
    // 여기서는 찾으면 그대로 반환합니다. (StoreDetailPage에서는 "전체" 카테고리가 올 일은 거의 없습니다)
    return { label: foundCategory.label, icon: foundCategory.icon };
  }
  // 정의되지 않은 카테고리 값이거나, API에서 넘어온 categoryValue가 null/undefined일 경우
  return { label: categoryValue || "정보 없음", icon: <HelpOutlineIcon fontSize="small" /> };
};