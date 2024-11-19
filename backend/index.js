const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    path:'/',
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 10000
}))


const userRouter = require("./src/routes/user")
app.use("/user",userRouter) // 가장 윗 계층

// const articleRouters = require("./src/routes/article")
// app.use("/article",articleRouters) // 가장 윗 계층 

// const commentRouters = require("./src/routes/comment")
// app.use("/comment",commentRouters)





app.listen(8000, () => {
    console.log("8000번 포트에서 HTTP 웹 서버 실행")
})
