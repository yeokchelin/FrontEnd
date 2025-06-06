// src/theme/muiTheme.js
import { createTheme } from '@mui/material/styles';

const getAppTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // ☀️ 라이트 모드 설정
          primary: {
            main: '#FFA726',
          },
          secondary: {
            main: '#FFFACD',
            contrastText: '#333333',
          },
          background: {
            default: '#F4F6F8',
            paper: '#FFFFFF',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
          action: {
            active: '#FFA726',
            hover: 'rgba(255, 167, 38, 0.08)',
          }
        }
      : {
          // 🌙 다크 모드 설정
          primary: {
            main: '#81C784',
          },
          secondary: {
            main: '#FFFACD',
            contrastText: '#333333',
          },
          background: {
            default: '#181818',
            paper: '#282828',
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
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // boxShadow: 'none',
        }
      }
    },
    // ★★★ MuiCssBaseline을 사용하여 전역 스크롤바 숨김 설정 ★★★
    MuiCssBaseline: {
      styleOverrides: `
        /* 웹킷(Chrome, Safari, Edge) 브라우저 스크롤바 숨기기 */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent; /* 스크롤바 트랙 부분도 투명하게 */
        }
        /* Firefox 브라우저 스크롤바 숨기기 */
        * { /* 모든 요소에 적용하여 확실히 숨김 */
          scrollbar-width: none;
        }
        /* IE 10+ 및 구 Edge 브라우저 스크롤바 숨기기 */
        html {
          -ms-overflow-style: none; /* IE and Edge */
        }
        body {
          -ms-overflow-style: none; /* IE and Edge */
        }
      `,
    },
  },
});

export default getAppTheme;