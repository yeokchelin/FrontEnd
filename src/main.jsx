// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // 기본 index.css (Vite 기본 제공)
import App from './App.jsx'; // 수정된 App 컴포넌트
import { BrowserRouter } from 'react-router-dom';

// App.css는 App.jsx 내부에서 CssBaseline과 함께 관리되거나,
// 최소한의 전역 스타일만 남겨둡니다. (이전 답변 참고)
// import './App.css'; // App.css 임포트 위치 (필요하다면 유지)

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);