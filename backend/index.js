const express = require("express");
const session = require("express-session");
const app = express();
const errorhandler = require("./src/utils/errorhandler");
const notfoundhandler = require("./src/utils/notFoundHandler")
const loggingMiddleware = require("./src/middlewares/logger");
require("dotenv").config();
const path = require('path');
const https = require("https");

app.use(express.json());
app.use(session({
    secret: 'secret-key',
    path:'/',
    httpOnly: true, // 찾아보기
    secure: false, //찾아보기
    maxAge: 24* 60 * 60 // 24시간 
}))


app.use(express.static(path.join(__dirname, 'public')));

app.use("/", loggingMiddleware);

const userRouter = require("./src/routes/user")
app.use("/user",userRouter) // 가장 윗 계층

const articleRouters = require("./src/routes/article")
app.use("/article",articleRouters) // 가장 윗 계층 

const articleRouter2 = require("./src/routes/articleV2")
app.use("/v2article",articleRouter2)

const commentRouters = require("./src/routes/comment")
app.use("/comment",commentRouters)

const adminRouters = require("./src/routes/admin")
app.use("/admin",adminRouters)

const logRouters = require("./src/routes/log")
app.use("/log",logRouters)

app.use(notfoundhandler)

app.use(errorhandler)

app.listen(8000, () => {
    console.log("______________________________________________")
    console.log("|      8000번 포트에서 HTTP 웹 서버 실행     |")
})
