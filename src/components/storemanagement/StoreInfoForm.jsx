// src/components/storemanagement/StoreInfoForm.jsx
import React from 'react';
// import { initialStoreInfo } from './dummyStoreData'; // 더 이상 여기서 초기 데이터 사용 안 함
import './StoreInfoForm.css';

// ❗️ props로 initialData와 onUpdate를 받습니다.
const StoreInfoForm = ({ initialData, onUpdate }) => {
  // ❗️ 부모로부터 받은 상태와 세터 함수 사용
  const { storeName, address, businessHours, contactNumber, storeDescription } = initialData;
  const { setStoreName, setAddress, setBusinessHours, setContactNumber, setStoreDescription } = onUpdate;

  const handleSubmit = (event) => {
    event.preventDefault();
    // 현재 상태값(initialData)이 이미 부모에 의해 관리되므로,
    // 저장 시 부모에게 알리거나 API 호출만 하면 됩니다.
    // 여기서는 initialData가 이미 최신 상태를 반영한다고 가정합니다.
    console.log('저장될 가게 정보 (부모 상태):', initialData);
    alert('가게 정보가 저장되었습니다! (콘솔 확인 및 미리보기 반영)');
    // 실제 API 호출은 StoreManagementPage에서 하거나, 여기서 트리거할 수 있습니다.
  };

  return (
    <form onSubmit={handleSubmit} className="store-info-form">
      <h2>가게 정보 수정</h2>

      <div className="form-group">
        <label htmlFor="storeName">상호명</label>
        <input
          type="text"
          id="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)} // 부모의 세터 함수 호출
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">주소</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)} // 부모의 세터 함수 호출
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="businessHours">영업시간</label>
        <textarea
          id="businessHours"
          value={businessHours}
          onChange={(e) => setBusinessHours(e.target.value)} // 부모의 세터 함수 호출
          rows="4"
          placeholder="예: 월-금: 09:00 - 20:00&#10;토: 10:00 - 18:00&#10;일: 휴무"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contactNumber">연락처</label>
        <input
          type="tel"
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)} // 부모의 세터 함수 호출
          placeholder="예: 02-1234-5678"
        />
      </div>

      <div className="form-group">
        <label htmlFor="storeDescription">가게 소개</label>
        <textarea
          id="storeDescription"
          value={storeDescription}
          onChange={(e) => setStoreDescription(e.target.value)} // 부모의 세터 함수 호출
          rows="6"
          placeholder="가게의 특징, 분위기, 주요 메뉴 등을 자유롭게 소개해주세요."
        />
      </div>

      <button type="submit" className="submit-button">가게 정보 저장</button>
    </form>
  );
};

export default StoreInfoForm;