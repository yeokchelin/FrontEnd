import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KakaoTokenHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
    }

    navigate("/");
  }, []);

  return <div>로그인 완료! 메인으로 이동 중...</div>;
}