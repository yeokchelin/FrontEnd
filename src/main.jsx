// src/main.jsx (또는 index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 반드시 임포트되어 있어야 함
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // ❗️❗️❗️ <React.StrictMode> 태그를 제거하거나 주석 처리합니다. ❗️❗️❗️
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>,
);