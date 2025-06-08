# [SK쉴더스 루키즈 개발 트랙 3기]
<img src="src/assets/yeokchelin.png" width="40%" height="30%" alt="MainImage"></img>
### 미니 프로젝트 2 - 역슐랭
> 서울 지하철 2호선 특화 맛집 정보 검색 및 사용자 참여형 커뮤니티 웹 서비스
---
## 🚀 주요 기능 (Features)
*역 기반 정밀 맛집 검색*
- 2호선 각 역을 중심으로 정확한 맛집 정보와 위치를 제공합니다.

*다중 조건 필터링* 
- 음식 종류, 가격대 등 다양한 조건을 조합하여 개인에게 최적화된 맛집을 찾을 수 있습니다.

*신뢰성 있는 정보 등록*
- 사업자 인증을 거친 음식점만 정보를 등록하고 관리하여 정보의 신뢰도를 확보합니다.

*사용자 리뷰 및 평점 공유*
- 실제 사용자들의 리뷰와 평점을 통해 생생한 정보를 공유하고 집단지성을 활용합니다.

*커뮤니티 기능*
- '밥친구 찾기' , '자유 게시판' 등 사용자 간의 자발적인 정보 교류와 소통을 위한 커뮤니티 공간을 제공합니다.
---
## 🛠️ 기술 스택 (Tech Stack)
> 본 시스템은 사용자 중심 설계 원칙에 따라 다음과 같은 기술 스택으로 개발되었습니다.

*프론트엔드*
- [React.js](https://react.dev/) (반응형 웹 구현)

*백엔드*
- [Spring Boot](https://spring.io/projects/spring-boot) (서버 로직 및 API 개발)

*데이터베이스*
- [MariaDB](https://mariadb.com/) (관계형 데이터 관리)

*버전 관리* 
- [Git](https://git-scm.com/**)

## 📂 폴더 구조 (Project Structure)
```
src
 ┣ api
 ┃ ┗ axiosInstance.js
 ┣ assets
 ┃ ┣ logo.png
 ┃ ┗ yeokchelin.png
 ┣ components
 ┃ ┣ comments
 ┃ ┃ ┣ CommentForm.jsx
 ┃ ┃ ┣ CommentItem.jsx
 ┃ ┃ ┗ CommentSection.jsx
 ┃ ┣ freeboard
 ┃ ┃ ┣ FreePostForm.jsx
 ┃ ┃ ┣ FreePostItem.jsx
 ┃ ┃ ┗ FreePostList.jsx
 ┃ ┣ main
 ┃ ┃ ┣ FilteredRestaurantListDisplay.jsx
 ┃ ┃ ┣ Header.jsx
 ┃ ┃ ┣ MetroMap.jsx
 ┃ ┃ ┣ Sidebar.jsx
 ┃ ┃ ┗ StationInfo.jsx
 ┃ ┣ mealmateboard
 ┃ ┃ ┣ MealMatePostForm.jsx
 ┃ ┃ ┣ MealMatePostItem.jsx
 ┃ ┃ ┗ MealMatePostList.jsx
 ┃ ┣ mypage
 ┃ ┃ ┣ FavoriteStoresSection.jsx
 ┃ ┃ ┗ MyActivityModal.jsx
 ┃ ┣ reviews
 ┃ ┃ ┣ ReviewForm.jsx
 ┃ ┃ ┣ ReviewItem.jsx
 ┃ ┃ ┗ ReviewList.jsx
 ┃ ┗ storemanagement
 ┃ ┃ ┣ CustomerReviewItem.jsx
 ┃ ┃ ┣ ReviewManagementSection.jsx
 ┃ ┃ ┣ StoreInfoForm.jsx
 ┃ ┃ ┗ StorePreview.jsx
 ┣ constants
 ┃ ┗ categoryConstants.jsx
 ┣ data
 ┃ ┗ stationLine2.js
 ┣ pages
 ┃ ┣ auth
 ┃ ┃ ┗ KakaoTokenHandler.jsx
 ┃ ┣ board
 ┃ ┃ ┣ FreeBoardPage.jsx
 ┃ ┃ ┗ MealMateBoardPage.jsx
 ┃ ┣ grade
 ┃ ┃ ┗ ChangeGradePage.jsx
 ┃ ┣ mypage
 ┃ ┃ ┗ MyPage.jsx
 ┃ ┣ review
 ┃ ┃ ┗ ReviewPage.jsx
 ┃ ┣ storedetail
 ┃ ┃ ┗ StoreDetailPage.jsx
 ┃ ┣ storemanagement
 ┃ ┃ ┣ MenuManagementPage.jsx
 ┃ ┃ ┗ StoreManagementPage.jsx
 ┃ ┣ todaymenu
 ┃ ┃ ┗ TodayMenuPage.jsx
 ┃ ┗ RestaurantPage.jsx
 ┣ theme
 ┃ ┗ muiTheme.js
 ┣ App.css
 ┣ App.jsx
 ┣ index.css
 ┗ main.jsx
```

- src/: 프로젝트의 모든 소스 코드가 포함되는 핵심 디렉토리입니다.
  - assets/: 이미지, 아이콘, 폰트 등 프로젝트에서 사용되는 정적 자산들을 관리합니다.

  - components/: 애플리케이션 전반에서 재사용될 수 있는 작은 UI 단위 컴포넌트들을 모아둡니다. (예: 버튼, 카드, 모달 등)
  
  - pages/: 라우터에 의해 특정 URL 경로에 매핑되는, 독립적인 페이지 단위의 컴포넌트들을 정의합니다. (예: 로그인 페이지, 상품 목록 페이지 등)
  
  - api/: 백엔드 API와 통신하기 위한 모든 네트워크 요청 관련 로직을 정의합니다. (Axios 설정, API 호출 함수 등)
    
  - store/: Redux 또는 기타 상태 관리 라이브러리를 사용하여 정의된 애플리케이션의 전역 상태 관리 로직과 관련된 파일들이 위치합니다. (Redux Toolkit의 slice, store 설정 등)
    
  - styles/: 전역적으로 적용되는 스타일 시트(index.css)나 공통으로 사용되는 스타일 유틸리티 파일들을 포함할 수 있습니다.
    
  - utils/: 날짜 포맷팅, 유효성 검사 등 애플리케이션 전반에서 재사용될 수 있는 보조 함수들이나 공통 로직을 포함합니다.
    
  - App.js / App.jsx: 애플리케이션의 최상위 컴포넌트로, 주로 라우팅 설정이나 전역 레이아웃을 담당합니다.
    
  - index.js / main.jsx: 애플리케이션의 시작점이며, React 앱을 DOM에 마운트(mount)하는 역할을 합니다.

- .gitignore: Git 버전 관리에서 추적하지 않을 파일이나 폴더를 지정합니다. (예: node_modules, .env 파일 등)

- package.json: 프로젝트의 메타데이터, 스크립트 명령어, 그리고 프로젝트가 의존하는 모든 Node.js 패키지(라이브러리) 목록을 정의합니다.

- vite.config.js: Vite 빌드 도구의 설정 파일로, 개발 서버, 번들링 옵션 등을 구성합니다.

- README.md: 현재 이 문서가 위치하는 파일로, 프로젝트에 대한 전반적인 설명을 담고 있습니다.
