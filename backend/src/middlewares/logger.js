// const EventEmitter = require('events');
// const eventEmitter = new EventEmitter();

// eventEmitter.on('log',(message,req,res)=>{
//     if(req&&res){
//         console.log(" ")
//         console.log(message)
//         console.log("==========log 출력============")
//         console.log("req값 ")
//         console.log("요청 타입", req.method)
//         console.log("응답상태코드",res.statusCode)
//         console.log("엔트리포인트",req.originalUrl)
//         console.log("log생성 시간")
//     }
//     console.log("===============================")
//     console.log(" ")
// })

// eventEmitter.on('error',(req,res,err)=>{
//     if(req&&res&&err){
//         console.log(" ")
//         console.log("======== Error log 출력========")
//         console.log("req값 ")
//         console.log("요청 타입", req.method)
//         console.log("응답상태코드",res.statusCode)
//         console.log("엔트리포인트",req.originalUrl)
//         console.log("에러 메시지", err.message)
//         console.log("log생성 시간")
//     }
//     console.log("===============================")
//     console.log(" ")
// })

// module.exports = eventEmitter;
const wrapper = require("../utils/wrapper");
const mongodb = require("../constants/mongodb");
const jwt = require("jsonwebtoken")

const loggingMiddleware = wrapper(async (req, res, next) => {
    // const {token} = req.headers;
    // req.decoded = jwt.verify(token,process.env.JWT_SIGNATURE_KEY)
    res.on("finish", async () => {
        // const client = await mongodb;
        // const mgdb = client.db("board");
        // const mgdb = await mongodb.db("board");

        // await mgdb.collection("log").insertOne({
        //     entryPoint: req.url,
        //     originalURL : req.originalURL,
        //     method: req.method,
        //     hostname: req.hostname,
        //     // request: req.body||req.params||req.query,
        //     //userId: req.decoded.userId,
        //     response_statusCode: res.statusCode,
        //     response : res.resValue,
        //     timestamp: new Date(),
        // });

        console.log("The response has been sent1");
    });
    next();
});

module.exports = loggingMiddleware;
// final 20250108
