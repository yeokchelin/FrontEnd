// 예시: components/poll/dummyPollData.js (또는 PollDetailPage 내부에 정의)
export const samplePoll = {
  id: 'poll123',
  title: '강남역 최고 돼지고기 맛집은?',
  description: '육즙 가득한 삼겹살, 당신의 선택은? 댓글로 각 식당의 장단점을 공유해주세요!',
  options: [
    {
      id: 'optionA',
      name: 'A 돼지고기집',
      imageUrl: 'https://via.placeholder.com/300x200/FFA07A/000000?Text=A+Pork', // 실제 이미지 URL로 대체
      description: '두툼한 숙성 삼겹살과 특제 소스가 일품!',
      voteCount: 120,
    },
    {
      id: 'optionB',
      name: 'B 돼지고기집',
      imageUrl: 'https://via.placeholder.com/300x200/ADD8E6/000000?Text=B+Pork', // 실제 이미지 URL로 대체
      description: '신선한 재료와 다양한 곁들임 메뉴가 장점!',
      voteCount: 95,
    },
  ],
  comments: [ // 댓글도 일단 간단히
    { id: 'c1', author: '미식가라이언', text: 'A식당은 고기 질이 정말 좋아요. 다만 웨이팅이 길어요.' },
    { id: 'c2', author: '프로혼밥러', text: 'B식당 가성비 최고! 혼밥 세트도 있으면 좋겠어요.' },
  ],
  status: 'open', // 'open', 'closed'
  createdAt: '2025-05-27T10:00:00Z',
};