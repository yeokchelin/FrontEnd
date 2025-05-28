// src/pages/storemanagement/StoreManagementPage.jsx
import React, { useState } from 'react';
import StoreInfoForm from '../../components/storemanagement/StoreInfoForm';
import StorePreview from '../../components/storemanagement/StorePreview'; // ❗️ 새로 만들 미리보기 컴포넌트
import { initialStoreInfo } from '../../components/storemanagement/dummyStoreData'; // 더미 데이터
import './StoreManagementPage.css';

const StoreManagementPage = () => {
  // ❗️ 가게 정보 상태를 여기서 관리합니다.
  const [storeName, setStoreName] = useState(initialStoreInfo.storeName);
  const [address, setAddress] = useState(initialStoreInfo.address);
  const [businessHours, setBusinessHours] = useState(initialStoreInfo.businessHours);
  const [contactNumber, setContactNumber] = useState(initialStoreInfo.contactNumber);
  const [storeDescription, setStoreDescription] = useState(initialStoreInfo.storeDescription);

  // ❗️ 자식 컴포넌트(StoreInfoForm)에서 사용할 수 있도록 상태 업데이트 함수들 정의
  const storeData = {
    storeName,
    address,
    businessHours,
    contactNumber,
    storeDescription,
  };

  const storeSetters = {
    setStoreName,
    setAddress,
    setBusinessHours,
    setContactNumber,
    setStoreDescription,
  };

  return (
    <div className="store-management-page">
      <header className="page-header">
        <h1>내 가게 관리</h1>
      </header>
      {/* ❗️ 메인 컨텐츠 영역을 flex로 나누어 왼쪽은 폼, 오른쪽은 미리보기 */}
      <div className="main-content-area">
        <section className="management-form-section">
          <StoreInfoForm 
            initialData={storeData} // 현재 상태값을 initialData로 전달
            onUpdate={storeSetters}   // 상태 변경 함수들을 onUpdate로 전달
          />
        </section>
        <aside className="preview-section">
          <h2>가게 페이지 미리보기</h2>
          <StorePreview storeInfo={storeData} /> {/* 현재 상태값을 미리보기에 전달 */}
        </aside>
      </div>
    </div>
  );
};

export default StoreManagementPage;