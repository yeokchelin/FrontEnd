// src/main.jsx
// import { StrictMode } from 'react' // StrictMode 임포트 제거
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // BrowserRouter 임포트

createRoot(document.getElementById('root')).render(
  // StrictMode를 제거하고 BrowserRouter만 남김
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);