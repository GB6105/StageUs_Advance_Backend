const express = require("express");
const session = require("express-session");
const app = express();
const errorhandler = require("./src/utils/errorhandler");
const notfoundhandler = require("./src/utils/notFoundHandler")
const loggingMiddleware = require("./src/middlewares/logger");
const path = require('path');
require("dotenv").config();

app.use(express.json());
app.use(session({
    secret: 'secret-key',
    path:'/',
    httpOnly: true, // 찾아보기
    secure: false, //찾아보기
    maxAge: 24* 60 * 60 // 24시간 
}))

// 정적 스트리밍
app.use(express.static(path.join(__dirname, 'public')));

//로그 저장
app.use("/", loggingMiddleware);

//사용자 정보 관련
const userRouter = require("./src/routes/user")
app.use("/user",userRouter) 

//게시글 관련
const articleRouters = require("./src/routes/article")
app.use("/article",articleRouters)

const articleRouter2 = require("./src/routes/articleV2")
app.use("/v2article",articleRouter2)

//댓글 관련
const commentRouters = require("./src/routes/comment")
app.use("/comment",commentRouters)

//관리자 기능 관련
const adminRouters = require("./src/routes/admin")
app.use("/admin",adminRouters)

//로그 확인 기능
const logRouters = require("./src/routes/log")
app.use("/log",logRouters)

// 에러 헨들러
app.use(notfoundhandler)
app.use(errorhandler)

app.listen(8000, () => {
    console.log("______________________________________________")
    console.log("|      8000번 포트에서 HTTP 웹 서버 실행     |")
})
//final 20250114