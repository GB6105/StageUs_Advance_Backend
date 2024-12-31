const { user } = require("pg/lib/defaults")
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const jwt = require("jsonwebtoken")

const authGuard = wrapper((req,res,next)=>{
    // const role = req.session.userRole;
    const {userRole} = req.decoded
    console.log(userRole)
    if(userRole != "admin") throw customError("관리자만 접근 가능합니다.",401)
    next()
})
module.exports = authGuard