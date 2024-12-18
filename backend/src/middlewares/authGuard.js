const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")

const authGuard = wrapper((req,res,next)=>{
    const role = req.session.userRole;
    if(role != "admin") throw customError("관리자만 접근 가능합니다.",401)
    next()
})
module.exports = authGuard