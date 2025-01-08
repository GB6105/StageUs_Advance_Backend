const { user } = require("pg/lib/defaults")
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const jwt = require("jsonwebtoken")

const authGuard = wrapper((req,res,next)=>{ // 이름을 admim으로 바꾸던가 권한에 대해서 
    // const role = req.session.userRole;
    const {userRole} = req.decoded
    console.log(userRole)
    if(userRole != "admin") throw customError("관리자만 접근 가능합니다.",401)
    next()
})
module.exports = authGuard

//final 20250108