const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('log',(message,req,res)=>{
    if(req&&res){
        console.log(" ")
        console.log(message)
        console.log("==========log 출력============")
        console.log("req값 ")
        console.log("요청 타입", req.method)
        console.log("응답상태코드",res.statusCode)
        console.log("엔트리포인트",req.originalUrl)
        console.log("log생성 시간")
    }
    console.log("===============================")
    console.log(" ")
})

eventEmitter.on('error',(req,res,err)=>{
    if(req&&res&&err){
        console.log(" ")
        console.log("======== Error log 출력========")
        console.log("req값 ")
        console.log("요청 타입", req.method)
        console.log("응답상태코드",res.statusCode)
        console.log("엔트리포인트",req.originalUrl)
        console.log("에러 메시지", err.message)
        console.log("log생성 시간")
    }
    console.log("===============================")
    console.log(" ")
})

module.exports = eventEmitter;
