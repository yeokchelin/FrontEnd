// src/pages/storemanagement/StoreManagementPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, Tabs, Tab } from '@mui/material';
import StoreInfoForm from '../../components/storemanagement/StoreInfoForm';
import StorePreview from '../../components/storemanagement/StorePreview';
import ReviewManagementSection from '../../components/storemanagement/ReviewManagementSection';
import { initialStoreInfo } from '../../components/storemanagement/dummyStoreData';
import MenuManagementPage from './MenuManagementPage'; // ❗️ 새로 만든 메뉴 관리 페이지 임포트

// 탭 패널을 위한 헬퍼 컴포넌트 (MUI 공식 문서 추천 방식)
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-management-tabpanel-${index}`}
      aria-labelledby={`store-management-tab-${index}`}
      {...other}
    >
      {value === index && (
        // 탭 내용에 일관된 상단 패딩 적용
        <Box sx={{ pt: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// 탭 접근성(ARIA) 속성을 위한 헬퍼 함수
function a11yProps(index) {
  return {
    id: `store-management-tab-${index}`,
    'aria-controls': `store-management-tabpanel-${index}`,
  };
}

const StoreManagementPage = () => {
  // 가게 정보 상태
  const [storeName, setStoreName] = useState(initialStoreInfo.storeName);
  const [address, setAddress] = useState(initialStoreInfo.address);
  const [businessHours, setBusinessHours] = useState(initialStoreInfo.businessHours);
  const [contactNumber, setContactNumber] = useState(initialStoreInfo.contactNumber);
  const [storeDescription, setStoreDescription] = useState(initialStoreInfo.storeDescription);

  const storeData = { storeName, address, businessHours, contactNumber, storeDescription };
  const storeSetters = { setStoreName, setAddress, setBusinessHours, setContactNumber, setStoreDescription };

  // 현재 선택된 탭 상태
  const [currentTab, setCurrentTab] = useState(0); // 0: 가게 정보, 1: 메뉴 관리, 2: 리뷰 관리

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, sm: 3, md: 4 }, // 페이지 전체의 상하 패딩
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // 페이지 내 주요 콘텐츠 블록들을 중앙 정렬
        gap: { xs: 2, sm: 3 },   // 제목, 탭, 탭 패널 사이의 간격
      }}
    >
      <Typography variant="h3" component="h1" sx={{ color: 'text.primary', fontWeight: 'bold', textAlign: 'center' }}>
        내 가게 관리
      </Typography>

      {/* 탭 네비게이션 */}
      <Paper elevation={1} sx={{ width: '100%', maxWidth: 'md', borderRadius: 1.5, mb: 1 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="가게 관리 탭 네비게이션"
          indicatorColor="primary" // 선택된 탭 하단 바 색상
          textColor="primary"      // 선택된 탭 텍스트 색상
          variant="fullWidth"      // 가능한 경우 탭들이 전체 너비를 차지하도록
          centered                 // 탭들을 중앙 정렬 (variant="fullWidth"와 함께 사용 시 효과)
        >
          <Tab label="가게 정보" {...a11yProps(0)} />
          <Tab label="메뉴 관리" {...a11yProps(1)} /> {/* disabled 속성 제거 및 레이블 변경 */}
          <Tab label="리뷰 관리" {...a11yProps(2)} />
        </Tabs>
      </Paper>

      {/* 각 탭에 해당하는 콘텐츠 패널 */}
      <TabPanel value={currentTab} index={0}>
        <Box // 가게 정보 탭의 메인 콘텐츠 영역 (폼 + 미리보기)
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 3, lg: 4 },
            alignItems: 'flex-start',
            width: '100%',
            maxWidth: 'xl',
            mx: 'auto',
          }}
        >
          {/* 가게 정보 수정 폼 섹션 */}
          <Box component="section" sx={{ flex: { lg: 1.75 }, width: '100%', order: { xs: 2, lg: 1 } }}>
            <StoreInfoForm initialData={storeData} onUpdate={storeSetters} />
          </Box>

          {/* 가게 페이지 미리보기 섹션 */}
          <Box component="aside" sx={{ flex: { lg: 1 }, width: '100%', order: { xs: 1, lg: 2 }, position: { lg: 'sticky' }, top: { lg: (theme) => theme.spacing(10) } , maxHeight: {lg: 'calc(100vh - 120px)'}, overflowY: {lg: 'auto'} }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: { xs: 'center', lg: 'left' }, color: 'text.secondary' }}>
              가게 페이지 미리보기
            </Typography>
            <StorePreview storeInfo={storeData} />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* 메뉴 관리 탭 내용 */}
        <MenuManagementPage /> {/* 새로 만든 메뉴 관리 페이지 컴포넌트 렌더링 */}
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {/* 리뷰 관리 */}
        <ReviewManagementSection />
      </TabPanel>
    </Box>
  );
};

export default StoreManagementPage;