const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const authGuard = require("../middlewares/authGuard")
const regx = require('../constants/regx')
const psql = require("../constants/psql")
const { user } = require("pg/lib/defaults")

// 사용자 권한 변경 (관리자만 가능)
router.patch("/ban",loginGuard, authGuard, validater("id",regx.id), wrapper(async (req,res)=>{
    const {id} = req.body;
    const userBanResult = await psql.query("UPDATE account.isbanned SET ban = 'T' WHERE account_id = $1 AND ban = 'F'",[id])
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

router.patch("/unban",loginGuard, authGuard, validater("id",regx.id), wrapper(async (req,res)=>{
    const {id} = req.body;
    const userUnBanResult = await psql.query("UPDATE account.isbanned SET ban = 'F' WHERE account_id = $1 AND ban = 'T'",[id])
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
router.get("", loginGuard, authGuard, wrapper(async (req,res)=>{
    const userList = await psql.query("SELECT * FROM account.list")
    if(userList.rows.length > 0){
        res.status(200).send({
            "userlist": userList.rows
        })
    }
}))

module.exports = router;