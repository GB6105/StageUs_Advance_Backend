// const mongoose = require("mongoose")

// mongoose.connect("mongodb://localhost:27017/board_log",{
//     useNewUrlParser: true,
//     userUnifiedTopology: true
// })

// const mgdb = mongoose.connection;
// mgdb.on("error",console.error);
// mgdb.once("open", function(){
//     console.log("Connction to mongoDB")
// })

// module.exports = mgdb;

const mongoose = require("mongoose");

// MongoDB 연결 함수
const connectToMongoDB = async () => {
    try {
        // MongoDB 연결
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/board_log", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const mgdb = mongoose.connection;

        // 연결 성공 시 로그
        mgdb.once("open", () => {
            console.log("=========== MongoDB 연결 성공 ===========");
        });

        return mgdb; // 연결된 데이터베이스 반환
    } catch (error) {
        // 에러 로그 출력
        console.error("MongoDB 연결 중 에러 발생:", error.message);
        process.exit(1); // 심각한 오류 시 프로세스 종료
    }
};

// MongoDB 연결 호출
const mgdb = connectToMongoDB();

module.exports = mgdb;
