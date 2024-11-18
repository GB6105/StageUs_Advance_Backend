const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(session({
    secure: true,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialied: true,
    cookie:{
        httpOnly: true,
        Secure: true
    },
    name: 'session-cookie'

}))


const userRouters = require("./src/routes/user")
app.use("/user",userRouters) // 가장 윗 계층

// const articleRouters = require("./src/routes/article")
// app.use("/article",articleRouters) // 가장 윗 계층 

// const commentRouters = require("./src/routes/comment")
// app.use("/comment",commentRouters)



//유저 더미 데이터 


app.listen(8000, () => {
    console.log("8000번 포트에서 HTTP 웹 서버 실행")
})
