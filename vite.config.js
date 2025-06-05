import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // <--- server 옵션 추가
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 API 서버의 주소입니다.
        changeOrigin: true, // true로 설정하면 요청의 Origin 헤더를 target URL의 Origin으로 변경하여 CORS 문제를 우회하는 데 도움이 됩니다.
      },
    },
  },
});