const express = require("express");
const maria = require("./database/connect/maria")
maria.connect();
const session = require("express-session");
const app = express();

app.use(express.json());
app.use(session({
    secret: 'secret-key',
    path:'/',
    httpOnly: true, // 찾아보기
    secure: false, //찾아보기
    maxAge: 24* 60 * 60 // 24시간 
}))

//
app.get("/select", (req,res)=>{
    maria.query('SELECT * FROM user',function(err,result,fds){
        if(err){
            console.log(err)
        }
        console.log(result);
        res.send(result);
    })
})


const userRouter = require("./src/routes/user")
app.use("/user",userRouter) // 가장 윗 계층

const articleRouters = require("./src/routes/article")
app.use("/article",articleRouters) // 가장 윗 계층 

const commentRouters = require("./src/routes/comment")
app.use("/comment",commentRouters)

app.listen(8000, () => {
    console.log("8000번 포트에서 HTTP 웹 서버 실행")
})
