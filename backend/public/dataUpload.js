// const customError = require("../src/utils/customError");

// async function uploadFiles(formData){
//     try{
//         const response = await fetch("https://3.38.114.206:8000/v2article",{
//             method : "POST",
//             body : formData,
//         });
//         if(!response.ok){
//             alert("업로드에 실패하였습니다");
//             throw customError("업로드 실패",500);
//         }
//         const result = await response.json();
//         console.log("upload success", result);

//     }catch(err){
//         alert("오류가 발생하였습니다.")
//         console.log("upload error", err.message);
//     }
// }

// function submitForm() {
//     const form = document.getElementById('uploadForm');
//     const formData = new FormData(form); 

//     uploadFiles(formData);
// }

async function uploadFiles(formData) {
    try {

        const token = localStorage.getItem("jwt");
        const response = await fetch("http://3.38.114.206:8000/v2article", {
            method: "POST",
            mode: "cors",
            headers: {
                "Authorization": token, // 토큰 포함
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload files");
        }

        const result = await response.json();
        console.log("Upload success:", result);
    } catch (err) {
        console.error("Upload error:", err.message);
    }
}

function submitForm() {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form); // 폼 데이터를 FormData 객체로 변환

    uploadFiles(formData); // fetch를 사용해 파일 및 데이터 전송
}