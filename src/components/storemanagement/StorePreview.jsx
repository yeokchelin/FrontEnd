// src/components/storemanagement/StorePreview.jsx
import React from 'react';
import './StorePreview.css'; // CSS 파일은 아래에서 만듭니다.

const StorePreview = ({ storeInfo }) => {
  const { storeName, address, businessHours, contactNumber, storeDescription } = storeInfo;

  // 영업시간 문자열에서 줄바꿈(\n)을 <br /> 태그로 변환하는 함수
  const formatMultilineText = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="store-preview">
      <div className="preview-header">
        {/* <img src="가게_로고_이미지_URL" alt={`${storeName} 로고`} className="store-logo-preview" /> */}
        <h3 className="store-name-preview">{storeName || "가게 이름이 여기에 표시됩니다."}</h3>
      </div>
      
      <div className="preview-section">
        <h4>주소</h4>
        <p>{address || "주소가 여기에 표시됩니다."}</p>
      </div>

      <div className="preview-section">
        <h4>영업시간</h4>
        <p>{businessHours ? formatMultilineText(businessHours) : "영업시간이 여기에 표시됩니다."}</p>
      </div>

      <div className="preview-section">
        <h4>연락처</h4>
        <p>{contactNumber || "연락처가 여기에 표시됩니다."}</p>
      </div>

      <div className="preview-section">
        <h4>가게 소개</h4>
        <p className="store-description-preview">
          {storeDescription ? formatMultilineText(storeDescription) : "가게 소개가 여기에 표시됩니다."}
        </p>
      </div>

      {/* 나중에 메뉴 목록 미리보기도 여기에 추가될 수 있습니다. */}
      {/* <div className="preview-section">
        <h4>메뉴</h4>
        <p>메뉴 목록 미리보기가 여기에 표시됩니다.</p>
      </div> */}
    </div>
  );
};

export default StorePreview;