// 예시: src/components/storemanagement/dummyReviewData.js (새 파일 또는 기존 dummyStoreData.js에 추가)
export const sampleReviews = [
  {
    id: 'review1',
    customerName: '맛잘알고객',
    rating: 5, // 별점 (선택 사항)
    text: '여기 정말 인생 맛집입니다! 특히 A메뉴는 꼭 드셔보세요. 분위기도 좋고 사장님도 친절하셔서 기분 좋게 식사했습니다. 재방문 의사 200%!!',
    createdAt: '2025-05-26T14:30:00Z',
    ownerReply: null, // 점주 답글 (초기에는 없음)
    // ownerReply: { text: '소중한 리뷰 감사합니다! A메뉴 좋아해주셔서 기쁘네요. 다음에 오시면 서비스 드릴게요! :)', repliedAt: '2025-05-27T10:00:00Z' } // 답글 예시
  },
  {
    id: 'review2',
    customerName: '까다로운미식가',
    rating: 3,
    text: '음식 맛은 보통이었어요. B메뉴는 양이 좀 적은 것 같고, C메뉴는 제 입맛에는 조금 짰습니다. 그래도 매장 청결도는 만족스러웠습니다.',
    createdAt: '2025-05-25T19:10:00Z',
    ownerReply: null,
  },
  {
    id: 'review3',
    customerName: '단골손님',
    rating: 5,
    text: '사장님, 어제도 잘 먹고 갑니다! D세트는 언제나 최고예요. 번창하세요!',
    createdAt: '2025-05-28T11:00:00Z',
    ownerReply: { text: '항상 찾아주셔서 감사합니다! D세트 좋아해주시니 힘이 납니다. 더 좋은 모습으로 보답하겠습니다!', repliedAt: '2025-05-28T11:15:00Z' }
  }
];