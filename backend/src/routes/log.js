//==========================[ Import ]===============================//
const router = require("express").Router();

//constants
const mongodb  = require("../constants/mongodb");

//custom middleware
const wrapper = require("../utils/wrapper");


//===========================[ Service ]==============================//


//로그 확인 API
router.get("", wrapper(async (req, res) => {
    const db = await mongodb();
    const { id, start_time, end_time, oldest } = req.body;

    // 기본 MongoDB 쿼리 객체
    const query = {};

    if (id) {
        query.id = id;
    }

    if (start_time && end_time) {
        query.timestamp = {
            $gte: new Date(start_time),
            $lte: new Date(end_time)
        };
    }

    let sortOption = { timestamp: -1 };

    if (oldest === "T") {
        sortOption = { timestamp: 1 };
    }

    const logList = await db.collection("log").find(query).sort(sortOption).toArray();

    res.status(200).send({
        data: logList
    });
}));


module.exports = router
//final 20250114

