// src/pages/storemanagement/StoreManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import StoreInfoForm from '../../components/storemanagement/StoreInfoForm';
import StorePreview from '../../components/storemanagement/StorePreview';
import ReviewManagementSection from '../../components/storemanagement/ReviewManagementSection';
import MenuManagementPage from './MenuManagementPage';
import axios from 'axios';

const API_BASE_URL = '/api';

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

function a11yProps(index) {
  return {
    id: `store-management-tab-${index}`,
    'aria-controls': `store-management-tabpanel-${index}`,
  };
}

const StoreManagementPage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [category, setCategory] = useState('한식');
  const [imageUrl, setImageUrl] = useState('');

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let storeToManage = null;
    try {
      const savedStoresData = localStorage.getItem('userRegisteredStores');
      console.log("[StoreManagementPage Debug] 로컬 스토리지 'userRegisteredStores' 값:", savedStoresData);

      if (savedStoresData) {
        const registeredStores = JSON.parse(savedStoresData);
        console.log("[StoreManagementPage Debug] 파싱된 registeredStores:", registeredStores);

        if (registeredStores && Array.isArray(registeredStores) && registeredStores.length > 0) {
          storeToManage = registeredStores[0];
          console.log("[StoreManagementPage Debug] 로드된 storeToManage:", storeToManage);

          setCurrentStoreId(storeToManage.storeId);
          setStoreName(storeToManage.name || '');
          setAddress(storeToManage.address || '');
          setBusinessHours(storeToManage.hours || '');
          setContactNumber(storeToManage.contact || '');
          setStoreDescription(storeToManage.description || '');
          setRegistrationNumber(storeToManage.registrationNumber || '');
          setCategory(storeToManage.category || '한식');
          setImageUrl(storeToManage.imageUrl || '');
        } else {
            console.log("[StoreManagementPage Debug] 'userRegisteredStores'는 있지만, 배열이 아니거나 비어있습니다.");
        }
      } else {
          console.log("[StoreManagementPage Debug] 'userRegisteredStores' 로컬 스토리지에 값이 없습니다.");
      }
    } catch (e) {
      console.error("StoreManagementPage: 로컬 스토리지에서 가게 정보를 불러오는데 실패했습니다.", e);
    } finally {
      setIsInitialLoadComplete(true);
      console.log("[StoreManagementPage Debug] 초기 로드 완료. currentStoreId (after load):", storeToManage?.storeId, "isInitialLoadComplete:", true);
    }
  }, []);

  const storeDataForForm = {
    currentStoreId, storeName, address, businessHours, contactNumber, storeDescription,
    registrationNumber, category, imageUrl
  };

  const storeSetters = {
    setStoreName,
    setAddress,
    setBusinessHours,
    setContactNumber,
    setStoreDescription,
    setRegistrationNumber,
    setCategory,
    setImageUrl, // ★★★ 이 위치에 쉼표가 누락되었을 가능성이 높습니다. ★★★
    handleSubmit: useCallback(async (formDataFromChild) => {
      if (!currentStoreId) {
        alert('수정할 가게가 선택되지 않았거나 가게 정보가 없습니다.');
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const updatePayload = {
          name: formDataFromChild.storeName,
          address: formDataFromChild.address,
          hours: formDataFromChild.businessHours,
          contact: formDataFromChild.contactNumber,
          description: formDataFromChild.storeDescription,
          registrationNumber: formDataFromChild.registrationNumber,
          category: formDataFromChild.category,
          imageUrl: formDataFromChild.imageUrl,
        };

        await axios.put(`${API_BASE_URL}/store/${currentStoreId}`, updatePayload);
        
        let savedStoresData = JSON.parse(localStorage.getItem('userRegisteredStores')) || [];
        const storeIndex = savedStoresData.findIndex(store => store.storeId === currentStoreId);

        if (storeIndex !== -1) {
          savedStoresData[storeIndex] = { ...savedStoresData[storeIndex], ...updatePayload };
          localStorage.setItem('userRegisteredStores', JSON.stringify(savedStoresData));
        }

        alert('가게 정보가 성공적으로 업데이트되었습니다!');
      } catch (e) {
        console.error("StoreManagementPage: 가게 정보 업데이트 중 오류 발생", e.response?.data || e.message || e);
        const errorMessage = e.response?.data?.message || e.message || "가게 정보 업데이트 중 오류 발생";
        setError(errorMessage);
        alert('가게 정보 업데이트 중 오류가 발생했습니다: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    }, [currentStoreId]), // 이 쉼표는 이 속성이 마지막이 아니면 필요합니다. 여기서는 마지막 속성이므로 필요 없습니다.
  }; // ★★★ 이 위치 (150:24)에 오류가 났으므로, 위에 쉼표가 누락되었을 가능성이 높습니다. ★★★


  const noStoreRegistered = !currentStoreId && isInitialLoadComplete;

  const handleTabChange = (event, newValue) => { setCurrentTab(newValue); };

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
                <StoreInfoForm
                    initialData={storeDataForForm}
                    onUpdate={storeSetters}
                    isNewStore={false}
                />
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