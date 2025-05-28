// src/pages/storemanagement/StoreManagementPage.jsx
import React, { useState } from 'react';
import StoreInfoForm from '../../components/storemanagement/StoreInfoForm';
import StorePreview from '../../components/storemanagement/StorePreview';
import ReviewManagementSection from '../../components/storemanagement/ReviewManagementSection'; // ❗️ 리뷰 관리 섹션 임포트
import { initialStoreInfo } from '../../components/storemanagement/dummyStoreData';
import './StoreManagementPage.css';

const StoreManagementPage = () => {
  const [storeName, setStoreName] = useState(initialStoreInfo.storeName);
  // ... (기존 가게 정보 상태 및 세터 함수들) ...
  const [address, setAddress] = useState(initialStoreInfo.address);
  const [businessHours, setBusinessHours] = useState(initialStoreInfo.businessHours);
  const [contactNumber, setContactNumber] = useState(initialStoreInfo.contactNumber);
  const [storeDescription, setStoreDescription] = useState(initialStoreInfo.storeDescription);

  const storeData = { storeName, address, businessHours, contactNumber, storeDescription };
  const storeSetters = { setStoreName, setAddress, setBusinessHours, setContactNumber, setStoreDescription };

  return (
    <div className="store-management-page">
      <header className="page-header">
        <h1>내 가게 관리</h1>
        {/* ❗️ 탭 네비게이션 (선택 사항, 추후 구현) 
        <nav>
          <button>가게 정보</button>
          <button>메뉴 관리</button>
          <button>리뷰 관리</button>
        </nav>
        */}
      </header>
      
      {/* 메인 컨텐츠 영역: 폼과 미리보기 */}
      <div className="main-content-area">
        <section className="management-form-section">
          {/* 현재는 가게 정보 폼만 있지만, 나중에는 탭에 따라 다른 폼/섹션 표시 가능 */}
          <StoreInfoForm 
            initialData={storeData}
            onUpdate={storeSetters}
          />
        </section>
        <aside className="preview-section">
          <h2>가게 페이지 미리보기</h2>
          <StorePreview storeInfo={storeData} />
        </aside>
      </div>

      {/* ❗️ 리뷰 관리 섹션 추가 */}
      <section className="management-content-fullwidth"> {/* 새로운 클래스 또는 기존 .management-section 활용 */}
        <ReviewManagementSection />
      </section>

      {/* <section className="management-content-fullwidth">
          <h2>메뉴 관리</h2>
          <p>메뉴 관리 기능이 여기에 추가될 예정입니다.</p>
        </section>
      */}
    </div>
  );
};

export default StoreManagementPage;