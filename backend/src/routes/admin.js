const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const authGuard = require("../middlewares/authGuard")
const adminCheck = require("../middlewares/adminCheck")
const regx = require('../constants/regx')
const psql = require("../constants/psql")

// 사용자 권한 변경 (관리자만 가능)
router.patch("/ban",loginGuard, adminCheck, validater("id",regx.id), wrapper(async (req,res)=>{
    const {id} = req.body;
    const userBanResult = await psql.query("UPDATE account.list SET role = 'banned' WHERE id = $1",[id])
    if(userBanResult.rowCount > 0){
        res.status(200).send({
            "message": "해당 사용자 권한을 변경하였습니다."
        })
    }
}))

router.patch("/unban",loginGuard, adminCheck, validater("id",regx.id), wrapper(async (req,res)=>{
    const {id} = req.body;
    const userUnBanResult = await psql.query("UPDATE account.list SET role = 'user' WHERE id = $1",[id])
    if(userUnBanResult.rowCount > 0){
        res.status(200).send({
            "message": "해당 사용자 권한을 변경하였습니다."
        })
    }
}))

// 사용자 목록 불러오기 (관리자만 가능)
router.get("", loginGuard, adminCheck, wrapper(async (req,res)=>{
    const userList = await psql.query("SELECT * FROM account.list")
    if(userList.rows.length > 0){
        res.status(200).send({
            "userlist": userList.rows[0]
        })
    }
}))

module.exports = router;