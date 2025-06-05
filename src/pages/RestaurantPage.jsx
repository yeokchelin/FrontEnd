// src/pages/RestaurantPage.jsx
import React, { useState, useCallback } from 'react'; // useCallback 임포트
import StationInfo from './main/StationInfo';
import StoreDetailPage from '../components/store/StoreDetailPage';

const RestaurantPage = () => {
  const [initialStationName] = useState("강남");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // useCallback을 사용하여 handleRestaurantSelect 함수가 불필요하게 재생성되는 것을 방지
  const handleRestaurantSelect = useCallback((restaurantId) => {
    console.log('[RestaurantPage] handleRestaurantSelect 호출됨! 선택된 ID:', restaurantId);
    setSelectedRestaurantId(restaurantId);
  }, []); // 의존성 배열이 비어있으므로, 이 함수는 컴포넌트가 처음 마운트될 때 한 번만 생성됩니다.

  // handleBackToList 함수도 useCallback으로 감싸줍니다.
  const handleBackToList = useCallback(() => {
    console.log('[RestaurantPage] 목록으로 돌아가기');
    setSelectedRestaurantId(null);
  }, []);

  console.log('[RestaurantPage] 현재 selectedRestaurantId 상태:', selectedRestaurantId);
  // 이 로그를 추가하여 RestaurantPage가 StationInfo를 렌더링하기 직전에
  // handleRestaurantSelect 함수가 실제로 함수인지 다시 한번 확인합니다.
  console.log('[RestaurantPage] StationInfo로 전달 예정인 onRestaurantSelect 타입:', typeof handleRestaurantSelect);


  if (selectedRestaurantId) {
    return (
      <StoreDetailPage
        restaurantId={selectedRestaurantId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <StationInfo
      stationName={initialStationName}
      onRestaurantSelect={handleRestaurantSelect} // 여기는 동일합니다.
    />
  );
};

export default RestaurantPage;