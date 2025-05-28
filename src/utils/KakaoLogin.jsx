export function kakaoLogin() {
  return new Promise((resolve, reject) => {
    const kakao = window.Kakao;

    if (!kakao) return reject("카카오 SDK 로딩 실패");

    if (!kakao.isInitialized()) {
      kakao.init("0635a58d5808ad7f20dfbbe9a418ac1e");
    }

    // 세션이 살아있으면 로그아웃 먼저
    if (kakao.Auth.getAccessToken()) {
      kakao.Auth.logout(() => {
        console.log("기존 세션 제거 완료");
        runLogin();
      });
    } else {
      runLogin();
    }

    function runLogin() {
      kakao.Auth.login({
        throughTalk: false, // 팝업 강제
        success(authObj) {
          console.log("로그인 성공", authObj);
          kakao.API.request({
            url: "/v2/user/me",
            success(res) {
              console.log("사용자 정보", res);
              localStorage.setItem("jwt", authObj.access_token);
              resolve(res);
            },
            fail(err) {
              console.error("사용자 정보 요청 실패", err);
              reject(err);
            }
          });
        },
        fail(err) {
          console.error("카카오 로그인 실패", err);
          reject(err);
        }
      });
    }
  });
}
