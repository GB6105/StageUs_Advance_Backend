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

// const resDotSendInterceptor = (res, send) => (content) => {
//     res.contentBody = content;
//     res.send = send;
//     res.send(content);
// };


// const requestLoggerMiddleware = ({ logger }) => (req, res, next) => {
//     logger("RECV <<<", req.method, req.url, req.hostname);
//     res.send = resDotSendInterceptor(res, res.send);
//     res.on("finish", () => {
//         logger("SEND >>>", res.contentBody);
//     });
//     next();
// };

// module.exports = { requestLoggerMiddleware };

const mongodb = require("../constants/mongodb")

const resDotSendInterceptor = (res, originalSend) => (content) => {
    res.contentBody = content; // 응답 내용을 저장
    originalSend.call(res, content); // 기존 res.send 호출
};

const requestLoggerMiddleware = ({ logger }) => async (req, res, next) => {
    const client = await mongodb();
    const db = client.db("board_log");
    logger("RECV <<<", req.method, req.url, req.hostname, res.statusCode);
    await db.collection("log").insertOne({
        "method" : req.method,
        "entryPoin" : req.url,
        "hostname" : req.hostname,
        "statusCode" : res.statusCode,
        "timestamp" : new Date()
    })

    const originalSend = res.send; // 기존 res.send 저장
    res.send = resDotSendInterceptor(res, originalSend); // res.send 재정의
    res.on("finish", () => {
        logger("SEND >>>", res.contentBody || "[No Content]"); // 응답 로그 출력
    });
    next();
};

module.exports = { requestLoggerMiddleware };

