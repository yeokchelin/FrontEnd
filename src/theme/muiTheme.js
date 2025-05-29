// src/theme/muiTheme.js
import { createTheme } from '@mui/material/styles';

// 테마 설정을 반환하는 함수 (라이트/다크 모드에 따라 다른 설정 적용)
const getAppTheme = (mode) => createTheme({
  palette: {
    mode, // 'light' 또는 'dark'
    ...(mode === 'light'
      ? {
          // ☀️ 라이트 모드 설정
          primary: {
            main: '#FFA726', // 예시: 레몬쉬폰과 어울리는 오렌지 계열 (또는 원하는 다른 색상)
          },
          secondary: {
            main: '#FFFACD', // 레몬 쉬폰 (라이트 모드에서도 액센트로 사용)
            contrastText: '#333333', // 레몬 쉬폰 배경 위의 텍스트 색상
          },
          background: {
            default: '#F4F6F8', // 전반적인 밝은 배경
            paper: '#FFFFFF',   // 카드, 사이드바, 헤더 등의 배경
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)', // 주요 텍스트
            secondary: 'rgba(0, 0, 0, 0.6)', // 부가적인 텍스트
          },
          action: {
            active: '#FFA726', // 액티브 상태 아이콘/버튼 등에 사용될 색상
            hover: 'rgba(255, 167, 38, 0.08)', // 호버 시 배경색 (투명도 조절)
          }
        }
      : {
          // 🌙 다크 모드 설정
          primary: {
            main: '#81C784', // 예시: 차분한 그린 계열 (또는 원하는 다른 색상)
          },
          secondary: {
            main: '#FFFACD', // 레몬 쉬폰
            contrastText: '#333333',
          },
          background: {
            default: '#181818', // 전반적인 어두운 배경
            paper: '#282828',   // 카드, 사이드바, 헤더 등의 배경
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#E0E0E0',
          },
          action: {
            active: '#FFFACD',
            hover: 'rgba(255, 250, 205, 0.08)',
          }
        }),
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif', // 전역 폰트 설정
    // 필요한 경우 h1, h2, body1 등 세부 타이포그래피 스타일 정의
  },
  components: {
    // 특정 MUI 컴포넌트의 전역 기본 스타일 오버라이드
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // 버튼 모서리 둥글게
          textTransform: 'none', // 버튼 텍스트 대문자 변환 없음
        },
        // containedSecondary: { // 필요시 레몬 쉬폰 버튼에 대한 추가 스타일 정의
        //   color: mode === 'light' ? '#333333' : '#333333',
        // },
      },
    },
    MuiAppBar: { // 예시: AppBar 기본 스타일
      styleOverrides: {
        root: {
          // AppBar에 대한 기본 스타일 (예: 그림자 없애기 등)
          // boxShadow: 'none',
        }
      }
    }
    // 다른 컴포넌트들 (MuiCard, MuiList 등)에 대한 기본 스타일도 여기서 설정 가능
  },
});

export default getAppTheme;