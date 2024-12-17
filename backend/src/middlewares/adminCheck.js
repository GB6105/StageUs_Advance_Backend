const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")


//roleGuard
const authenticator = wrapper((req,res,next)=>{
    const role = req.session.userRole;
    // 작성자 id 받아오기
    if(role != "admin") throw customError("관리자만 접근 가능합니다.",401)
    next()
})
module.exports =authenticator