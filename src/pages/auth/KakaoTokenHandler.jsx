// src/pages/auth/KakaoTokenHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 다시 임포트
// import { jwtDecode } from "jwt-decode"; // 수동 디코딩 사용 시 주석 처리

// JWT 페이로드를 수동으로 디코딩하는 함수 (이전과 동일)
function decodeJwtManually(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format: Token does not have 3 parts.');
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Manual JWT decode error:", e);
    return null;
  }
}

export default function KakaoTokenHandler() {
  const navigate = useNavigate(); // useNavigate 훅 다시 사용

  useEffect(() => {
    // 디버깅 로그 (이전과 동일)
    console.log("KakaoTokenHandler: window.location.href at load:", window.location.href);
    console.log("KakaoTokenHandler: window.location.search at load:", window.location.search);

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);

      try {
        const decodedToken = decodeJwtManually(token); // 수동 디코딩 함수 사용

        if (!decodedToken) {
            console.error("KakaoTokenHandler: Decoded token is null or invalid after manual decode.");
            throw new Error("디코딩된 토큰 페이로드가 유효하지 않습니다.");
        }

        const userId = decodedToken.userId;
        const nickname = decodedToken.nickname;
        const profileImage = decodedToken.profileImage;

        // 디버깅 로그 (이전과 동일)
        console.log("KakaoTokenHandler: Decoded JWT Payload (raw):", decodedToken);
        console.log("KakaoTokenHandler: Extracted userId:", userId, "Type:", typeof userId);
        console.log("KakaoTokenHandler: Extracted nickname:", nickname, "Type:", typeof nickname);
        console.log("KakaoTokenHandler: Extracted profileImage:", profileImage, "Type:", typeof profileImage);

        if (userId) {
          localStorage.setItem("currentUserId", userId);
        } else {
          console.warn("KakaoTokenHandler: Extracted userId is null or undefined from decoded token. Not storing.");
        }
        if (nickname) {
          localStorage.setItem("currentUserNickname", nickname);
        }
        if (profileImage) {
          localStorage.setItem("currentUserAvatarUrl", profileImage);
        }

        console.log("KakaoTokenHandler: Saved to localStorage. Checking localStorage content:");
        console.log("localStorage 'currentUserId':", localStorage.getItem("currentUserId"));

      } catch (error) {
        console.error("KakaoTokenHandler: JWT 디코딩 또는 사용자 정보 추출 실패:", error);
        localStorage.removeItem("jwt");
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("currentUserNickname");
        localStorage.removeItem("currentUserAvatarUrl");
      }
    } else {
      console.warn("KakaoTokenHandler: 로그인 토큰을 받지 못했습니다. (URL에 토큰 없음)");
    }

    // ❗️❗️❗️ 여기에 setTimeout을 추가합니다. ❗️❗️❗️
    setTimeout(() => {
      navigate("/"); // 지연 후 메인 페이지로 이동
    }, 50); // 50ms (0.05초) 지연

  }, [navigate]);

  return <div>로그인 완료! 메인으로 이동 중...</div>;
}