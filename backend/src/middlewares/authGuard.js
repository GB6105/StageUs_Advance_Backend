const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")

const authenticator = wrapper((req,res,next)=>{
    const role = req.session.userRole;
    // 작성자 id 받아오기
    if(role == "banned") throw customError("해당 계정으로는 현재 기능을 이용하실 수 없습니다.",401)
    next()
})
module.exports =authenticator