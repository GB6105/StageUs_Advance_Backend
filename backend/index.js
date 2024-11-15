const express = require("express")
const app = express()
app.use(express.json())

app.listen(8000, () => {
    console.log("8000번 포트에서 HTTP 웹 서버 실행")
})


//유저 더미 데이터 
const userData = [
    { name: "user1", id: "test1", pw: "test1111", age: 20, gender: "M", phone: "010-1111-1111", email: "test1@gmail.com", address: "Korea" },
    { name: "user2", id: "test2", pw: "test2222", age: 30, gender: "F", phone: "010-2222-2222", email: "test2@gmail.com", address: "Japan" },
    { name: "user3", id: "test3", pw: "test3333", age: 40, gender: "M", phone: "010-3333-3333", email: "test3@gmail.com", address: "Canada" }
];

