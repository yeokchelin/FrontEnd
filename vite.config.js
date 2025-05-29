import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // <--- server 옵션 추가
    proxy: {
      // '/api'로 시작하는 모든 요청을 http://localhost:8080으로 프록시합니다.
      // 예를 들어, 프론트엔드 코드에서 fetch('/api/restaurants')를 호출하면,
      // 실제로는 http://localhost:8080/api/restaurants 로 요청이 전달됩니다.
      '/api': {
        target: 'http://localhost:8080', // 백엔드 API 서버의 주소입니다.
        changeOrigin: true, // true로 설정하면 요청의 Origin 헤더를 target URL의 Origin으로 변경하여 CORS 문제를 우회하는 데 도움이 됩니다.
        // 만약 백엔드 API가 '/api'라는 접두사 없이 바로 '/restaurants'와 같은 엔드포인트를 사용한다면,
        // 아래 rewrite 옵션을 사용하여 요청 경로에서 '/api'를 제거할 수 있습니다.
        // 예: '/api/restaurants' 요청을 '/restaurants'로 변경하여 백엔드로 전달
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 필요하다면 다른 경로에 대한 프록시 규칙을 추가할 수도 있습니다.
      // 예: '/another-api-prefix': { target: 'http://another-backend-server.com', changeOrigin: true }
    },
  },
});