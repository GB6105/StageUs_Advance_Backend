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

// const wrapper = require("../utils/wrapper")
// const { MongoClient } = require("mongodb");


// MongoDB 연결 함수
// const mongodb = wrapper(async () => {
// const client = new MongoClient("mongodb://localhost:27017", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             maxPoolSize: 10, // 최대 연결 수 (Connection Pool 크기)
//             minPoolSize: 2,  // 최소 연결 수 // 왜 최소 2개 사용하는가 찾아보기기
//             waitQueueTimeoutMS: 5000, // 연결 대기 시간 (밀리초)
//         });

//         await client.connect(); // MongoDB 연결
//         console.log("|============= MongoDB 연결 성공 ============|");
//         //let db = await client.db("board_log"); // 사용할 데이터베이스 선택
//         //return db; // Database 인스턴스를 반환
//         return client;;
// });

const wrapper = require("../utils/wrapper")
// const { MongoClient } = require("mongodb");

// const mongodb = wrapper(async ()=>{
//     const client = new MongoClient(
//         "mongodb://localhost:27017",
//         {
//             maxPoolSize: 10, // 최대 연결 수 (Connection Pool 크기)
//             minPoolSize: 2,  // 최소 연결 수 // 왜 최소 2개 사용하는가 찾아보기기
//             waitQueueTimeoutMS: 5000, // 연결 대기 시간 (밀리초)
//         }
//     );
//     const connection = await client.connect();
//     console.log("|============= MongoDB 연결 성공 ============|");
//     return connection;
// })

// mongodb();


// const wrapper = require("../utils/wrapper")
// const client = require("mongodb").MongoClient;

// const mongodb = client.connect("mongodb://localhost:27017",
//     {
//         maxPoolsize: 10,
//         minPoolSize:2
//     }
// );

// module.exports = mongodb;


const { MongoClient } = require("mongodb");

let connection = null;

const mongodb = (async () => {
    if (!connection) {
        const client = new MongoClient("mongodb://localhost:27017", {
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        connection = await client.connect();
        console.log("|============= MongoDB 연결 성공 ============|");
    }
    return connection;
})();

module.exports = mongodb;
