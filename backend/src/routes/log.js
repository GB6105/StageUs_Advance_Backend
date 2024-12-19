const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const authGuard = require("../middlewares/authGuard")
const regx = require('../constants/regx')
const psql = require("../constants/psql")
const { connectToDatabase } = require("../constants/mongodb");

// router.get("",wrapper(async (req,res)=>{
//     const db = await connectToDatabase();
    
//     const logList = await db.collection("log").find().toArray()
//     res.status(200).send({
//         "data":logList
//     })
// }))

router.get("", wrapper(async (req, res) => {
    const db = await connectToDatabase();
    const { id, start_time, end_time, oldest } = req.body;

    // 기본 MongoDB 쿼리 객체
    const query = {};

    // 분기 1: ID 조건 추가
    if (id) {
        query.id = id;
    }

    // 분기 2: 시간 범위 조건 추가
    if (start_time && end_time) {
        query.timestamp = {
            $gte: new Date(start_time),
            $lte: new Date(end_time)
        };
    }

    // 기본 정렬 기준: 최신순 (내림차순)
    let sortOption = { timestamp: -1 };

    // 분기 3: `oldest` 조건 추가 (오름차순)
    if (oldest === "T") {
        sortOption = { timestamp: 1 };
    }

    // MongoDB에서 데이터 조회
    const logList = await db.collection("log").find(query).sort(sortOption).toArray();

    // 결과 반환
    res.status(200).send({
        data: logList
    });
}));


module.exports = router