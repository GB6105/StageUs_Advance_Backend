const router = require("express").Router()
//const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const authGuard = require("../middlewares/authGuard")
const regx = require('../constants/regx')
const psql = require("../constants/psql")
const { user } = require("pg/lib/defaults")

// 사용자 권한 변경 (관리자만 가능)
router.patch("/userBan",
    loginGuard,
    authGuard,
    validater("id",regx.id), wrapper(async (req,res)=>{
    const {id} = req.body;
    const userBanResult = await psql.query("UPDATE account.list SET isbanned = 'T' WHERE id = $1 AND isbanned = 'F'",[id])
    console.log(userBanResult);
    if(userBanResult.rowCount > 0){
        res.status(200).send({
            "message": "해당 사용자 권한을 변경하였습니다."
        })
    }else{
        res.status(409).send({
            "message": "이미 정지된 사용자입니다."
        })
    }
}))

router.patch("/userUnban",
    loginGuard, 
    authGuard, 
    validater("id",regx.id), wrapper(async (req,res)=>{
    const {id} = req.body;
    const userUnBanResult = await psql.query("UPDATE account.list SET isbanned = 'F' WHERE id = $1 AND isbanned = 'T'",[id])
    console.log(userUnBanResult);
    if(userUnBanResult.rowCount > 0){
        res.status(200).send({
            "message": "해당 사용자 권한을 변경하였습니다."
        })
    }else{
        res.status(409).send({
            "message": "이미 활성화된 사용자입니다."
        })
    }
}))

// 사용자 목록 불러오기 (관리자만 가능)
router.get("/userlist", loginGuard, authGuard, wrapper(async (req,res)=>{
    const userList = await psql.query("SELECT * FROM account.list")
    if(userList.rows.length > 0){
        res.status(200).send({
            "userlist": userList.rows
        })
    }
}))

// 로그 확인 API
router.get("/logList", wrapper(async (req, res) => {
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


module.exports = router;
//final 20250108
