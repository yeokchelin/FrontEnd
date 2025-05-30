// src/pages/storemanagement/StoreManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import StoreInfoForm from '../../components/storemanagement/StoreInfoForm';
import StorePreview from '../../components/storemanagement/StorePreview';
import ReviewManagementSection from '../../components/storemanagement/ReviewManagementSection';
import MenuManagementPage from './MenuManagementPage';

// 탭 패널을 위한 헬퍼 컴포넌트 (파일 상단에 한 번만 정의)
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
        <Box sx={{ pt: { xs: 2, sm: 3 }, width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// 탭 접근성(ARIA) 속성을 위한 헬퍼 함수 (파일 상단에 한 번만 정의)
function a11yProps(index) {
  return {
    id: `store-management-tab-${index}`,
    'aria-controls': `store-management-tabpanel-${index}`,
  };
}

const StoreManagementPage = () => {
  // ... (컴포넌트의 나머지 로직은 이전 답변과 동일합니다) ...
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    let storeToManage = null;
    let localStoreId = null;
    let localStoreName = '';
    let localAddress = '';
    let localBusinessHours = '';
    let localContactNumber = '';
    let localStoreDescription = '';
    let localRegistrationNumber = '';

    try {
      const savedStoresData = localStorage.getItem('userRegisteredStores');
      if (savedStoresData) {
        const registeredStores = JSON.parse(savedStoresData);
        if (registeredStores && registeredStores.length > 0) {
          storeToManage = registeredStores[0];
          localStoreId = storeToManage.id;
          localStoreName = storeToManage.name || '';
          localAddress = storeToManage.address || '';
          localBusinessHours = storeToManage.hours || '';
          localContactNumber = storeToManage.contact || '';
          localStoreDescription = storeToManage.description || '';
          localRegistrationNumber = storeToManage.registrationNumber || '';
        }
      }
    } catch (e) {
      console.error("StoreManagementPage: 로컬 스토리지에서 가게 정보를 불러오는데 실패했습니다.", e);
    }

    setCurrentStoreId(localStoreId);
    setStoreName(localStoreName);
    setAddress(localAddress);
    setBusinessHours(localBusinessHours);
    setContactNumber(localContactNumber);
    setStoreDescription(localStoreDescription);
    setRegistrationNumber(localRegistrationNumber);
    setIsInitialLoadComplete(true);
  }, []);

  const storeDataForForm = { currentStoreId, storeName, address, businessHours, contactNumber, storeDescription, registrationNumber };
  const storeSetters = {
    setStoreName, setAddress, setBusinessHours, setContactNumber, setStoreDescription, setRegistrationNumber,
    handleSubmit: (formDataFromChild) => {
      if (!currentStoreId) {
        alert('수정할 가게가 선택되지 않았거나 가게 정보가 없습니다.');
        return;
      }
      try {
        const savedStoresData = localStorage.getItem('userRegisteredStores');
        let registeredStores = savedStoresData ? JSON.parse(savedStoresData) : [];
        const storeIndex = registeredStores.findIndex(store => store.id === currentStoreId);

        if (storeIndex !== -1) {
          const updatedStore = {
            ...registeredStores[storeIndex],
            name: formDataFromChild.storeName,
            address: formDataFromChild.address,
            hours: formDataFromChild.businessHours,
            contact: formDataFromChild.contactNumber,
            description: formDataFromChild.storeDescription,
            registrationNumber: registrationNumber, // 부모의 registrationNumber 상태 사용
          };
          registeredStores[storeIndex] = updatedStore;
          localStorage.setItem('userRegisteredStores', JSON.stringify(registeredStores));

          setStoreName(updatedStore.name);
          setAddress(updatedStore.address);
          setBusinessHours(updatedStore.hours);
          setContactNumber(updatedStore.contact);
          setStoreDescription(updatedStore.description);
          
          alert('가게 정보가 성공적으로 업데이트되었습니다!');
        } else {
          alert('수정할 가게 정보를 찾을 수 없습니다. 목록을 새로고침하거나 다시 시도해주세요.');
        }
      } catch (e) {
        console.error("StoreManagementPage: 가게 정보 업데이트 중 오류 발생", e);
        alert('가게 정보 업데이트 중 오류가 발생했습니다.');
      }
    }
  };

  const [currentTab, setCurrentTab] = useState(0);
  const handleTabChange = (event, newValue) => { setCurrentTab(newValue); };
  const noStoreRegistered = !currentStoreId;

  if (!isInitialLoadComplete) {
    return <Box sx={{p:3, textAlign:'center'}}><Typography>가게 정보 로딩 중...</Typography></Box>;
  }

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
      <Typography variant="h3" component="h1" sx={{ color: 'text.primary', fontWeight: 'bold', textAlign: 'center' }}>
        내 가게 관리
      </Typography>
      <Paper elevation={1} sx={{ width: '100%', maxWidth: 'md', borderRadius: 1.5, mb: 1 }}>
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" centered >
          <Tab label="가게 정보" {...a11yProps(0)} disabled={noStoreRegistered} />
          <Tab label="메뉴 관리" {...a11yProps(1)} disabled={noStoreRegistered} />
          <Tab label="리뷰 관리" {...a11yProps(2)} disabled={noStoreRegistered} />
        </Tabs>
      </Paper>

      {noStoreRegistered && (
        <Paper elevation={2} sx={{p:3, textAlign:'center', mt:2, width:'100%', maxWidth:'md'}}>
            <Typography variant="h6" color="text.secondary">관리할 가게 정보가 없습니다.</Typography>
            <Typography variant="body1" color="text.secondary" sx={{mt:1}}>
                먼저 "회원 등급 변경" 페이지에서 가게를 등록해주세요.
            </Typography>
        </Paper>
      )}

      {!noStoreRegistered && (
        <>
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 3, lg: 4 }, alignItems: 'flex-start', width: '100%', maxWidth: 'xl', mx: 'auto' }}>
              <Box component="section" sx={{ flex: { lg: 1.75 }, width: '100%', order: { xs: 2, lg: 1 } }}>
                <StoreInfoForm initialData={storeDataForForm} onUpdate={storeSetters} isNewStore={false} />
              </Box>
              <Box component="aside" sx={{ flex: { lg: 1 }, width: '100%', order: { xs: 1, lg: 2 }, position: { lg: 'sticky' }, top: { lg: (theme) => theme.spacing(10) } , maxHeight: {lg: 'calc(100vh - 120px)'}, overflowY: {lg: 'auto'} }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: { xs: 'center', lg: 'left' }, color: 'text.secondary' }}> 가게 페이지 미리보기 </Typography>
                <StorePreview storeInfo={storeDataForForm} />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <MenuManagementPage storeId={currentStoreId} />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <ReviewManagementSection storeId={currentStoreId} />
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default StoreManagementPage;

// ❗️❗️❗️ 파일 하단에 있던 TabPanel 및 a11yProps 중복 정의를 여기서 삭제했습니다. ❗️❗️❗️
// helper 함수들은 파일 상단에 한 번만 정의되어야 합니다.