// const client = require("mongodb").MongoClient
// const wrapper = require("../utils/wrapper")


// const mongodb = wrapper(async ()=>{
//     const connect = await client.connect("mongodb://localhost:27017")
//     console.log("|============= MongdDB 연결 성공 ============|")
//     return connect;
// })
// mongodb();
// module.exports = mongodb;

const { MongoClient } = require("mongodb");

// MongoDB 연결 함수
const connectToDatabase = async () => {

        const client = new MongoClient("mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // 최대 연결 수 (Connection Pool 크기)
            minPoolSize: 2,  // 최소 연결 수
            waitQueueTimeoutMS: 5000, // 연결 대기 시간 (밀리초)
        });

        await client.connect(); // MongoDB 연결
        console.log("|============= MongoDB 연결 성공 ============|");
        const db = client.db("board_log"); // 사용할 데이터베이스 선택
    return db; // Database 인스턴스를 반환
};


module.exports = {connectToDatabase};
