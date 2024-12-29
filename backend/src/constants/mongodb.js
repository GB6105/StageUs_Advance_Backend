// const client = require("mongodb").MongoClient
// const wrapper = require("../utils/wrapper")

// const mongodb = wrapper(async ()=>{
//     const connect = await client.connect("mongodb://localhost:27017")
//     console.log("|============= MongdDB 연결 성공 ============|")
//     return connect;
// })
// mongodb();
// module.exports = mongodb;

// const { MongoClient } = require("mongodb");

// // MongoDB 연결 함수
// const connectToDatabase = async () => {

//         const client = new MongoClient("mongodb://localhost:27017", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             maxPoolSize: 10, // 최대 연결 수 (Connection Pool 크기)
//             minPoolSize: 2,  // 최소 연결 수 // 왜 최소 2개 사용하는가 찾아보기기
//             waitQueueTimeoutMS: 5000, // 연결 대기 시간 (밀리초)
//         });

//         await client.connect(); // MongoDB 연결
//         console.log("|============= MongoDB 연결 성공 ============|");
//         const db = client.db("board_log"); // 사용할 데이터베이스 선택
//     return db; // Database 인스턴스를 반환
// };


// module.exports = {connectToDatabase};

const wrapper = require("../utils/wrapper")
const { MongoClient } = require("mongodb");


// MongoDB 연결 함수
const mongodb = wrapper(async () => {
const client = new MongoClient("mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // 최대 연결 수 (Connection Pool 크기)
            minPoolSize: 2,  // 최소 연결 수 // 왜 최소 2개 사용하는가 찾아보기기
            waitQueueTimeoutMS: 5000, // 연결 대기 시간 (밀리초)
        });

        await client.connect(); // MongoDB 연결
        console.log("|============= MongoDB 연결 성공 ============|");
        //let db = await client.db("board_log"); // 사용할 데이터베이스 선택
        //return db; // Database 인스턴스를 반환
        return client;;
});


module.exports = mongodb;

// const { MongoClient } = require("mongodb");

// let dbInstance = null; // DB 인스턴스를 캐싱하기 위한 변수
// let clientInstance = null; // MongoClient 인스턴스를 캐싱하기 위한 변수

// // MongoDB 연결 함수
// const connectDB = async () => {
//     if (!dbInstance) {
//         try {
//             clientInstance = new MongoClient("mongodb://localhost:27017", {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//                 maxPoolSize: 10,
//                 minPoolSize: 2,
//                 waitQueueTimeoutMS: 5000,
//             });

//             // MongoDB 연결
//             await clientInstance.connect();
//             console.log("|============= MongoDB 연결 성공 ============|");
//             dbInstance = clientInstance.db("board_log"); // 사용할 데이터베이스 선택
//         } catch (error) {
//             console.error("MongoDB 연결 실패:", error);
//             throw error; // 연결 실패 시 오류를 던짐
//         }
//     }
//     return dbInstance; // 캐싱된 DB 인스턴스 반환
// };

// // // MongoDB 연결 해제 함수
// // const disconnectDB = async () => {
// //     if (clientInstance) {
// //         try {
// //             await clientInstance.close();
// //             console.log("|============= MongoDB 연결 해제 성공 ============|");
// //             dbInstance = null;
// //             clientInstance = null;
// //         } catch (error) {
// //             console.error("MongoDB 연결 해제 실패:", error);
// //         }
// //     }
// // };

// module.exports = {
//     connectDB
//     //disconnectDB,
// };
