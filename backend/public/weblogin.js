async function login() {
    const id = document.getElementById("id").value; // 로그인 폼에서 ID 가져오기
    const pw = document.getElementById("pw").value; // 로그인 폼에서 PW 가져오기

    try {
        const response = await fetch("http://localhost:8000/user", {
            method: "GET", // 서버의 HTTP 메서드와 맞춰야 함
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, pw }), // ID와 PW를 JSON으로 전송
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "로그인 실패");
        }

        const data = await response.json(); // 서버의 응답 데이터
        console.log("로그인 성공:", data);

        // JWT 토큰 저장
        localStorage.setItem("jwt", data.accessToken);

        // 로그인 성공 시 리다이렉션 등 추가 작업
        alert("로그인 성공!");
        window.location.href = "/dashboard.html"; // 대시보드 페이지로 이동
    } catch (err) {
        console.error("Error:", err.message);
        alert("로그인 실패: " + err.message);
    }
}
