const express = require("express");
const session = require("express-session");
const app = express();
const mongodb = require("./src/constants/mongodb")
const eventEmitter = require("./src/middlewares/logger")

require("dotenv").config();

app.use(express.json());
app.use(session({
    secret: 'secret-key',
    path:'/',
    httpOnly: true, // 찾아보기
    secure: false, //찾아보기
    maxAge: 24* 60 * 60 // 24시간 
}))

const userRouter = require("./src/routes/user")
app.use("/user",userRouter) // 가장 윗 계층

const articleRouters = require("./src/routes/article")
app.use("/article",articleRouters) // 가장 윗 계층 

const commentRouters = require("./src/routes/comment")
app.use("/comment",commentRouters)

const adminRouters = require("./src/routes/admin")
app.use("/admin",adminRouters)


app.listen(8000, () => {
    console.log("______________________________________________")
    console.log("|      8000번 포트에서 HTTP 웹 서버 실행     |")
})

// const express = require("express");
// const session = require("express-session");
// const eventEmitter = require("./src/middlewares/logger");
// const mongodb = require("./src/constants/mongodb");

// require("dotenv").config();

// const app = express();

// // 요청 JSON 처리
// app.use(express.json());

// // 세션 설정
// app.use(session({
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true, // 클라이언트에서 쿠키 접근 금지
//         secure: false,  // HTTPS에서만 사용 (배포 시 true 설정)
//         maxAge: 24 * 60 * 60 * 1000 // 24시간
//     }
// }));

// // 요청 로깅 미들웨어
// app.use((req, res, next) => {
//     eventEmitter.emit("request", "새로운 요청이 수신되었습니다.", { method: req.method, path: req.path });
//     next();
// });

// // 라우터 연결
// const userRouter = require("./src/routes/user");
// app.use("/user", userRouter);

// const articleRouters = require("./src/routes/article");
// app.use("/article", articleRouters);

// const commentRouters = require("./src/routes/comment");
// app.use("/comment", commentRouters);

// const adminRouters = require("./src/routes/admin");
// app.use("/admin", adminRouters);

// // 404 처리 미들웨어
// app.use((req, res) => {
//     eventEmitter.emit("error", "요청 경로를 찾을 수 없습니다.", { path: req.originalUrl });
//     res.status(404).send({
//         message: "경로를 찾을 수 없습니다."
//     });
// });

// // 서버 시작
// app.listen(8000, () => {
//     console.log("______________________________________________");
//     console.log("|      8000번 포트에서 HTTP 웹 서버 실행     |");
// });
