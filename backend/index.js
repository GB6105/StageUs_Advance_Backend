const express = require("express")
const app = express()
app.use(express.json())


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
