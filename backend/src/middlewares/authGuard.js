const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")

const authGuard = wrapper((req,res,next)=>{
    // const id = req.session.userid;
    const role = req.session.userRole;
    // 작성자 id 받아오기
    if(role == "banned") throw customError("해당 계정으로는 현재 기능을 이용하실 수 없습니다.",401)
    // if(id != "")
    next()
})
module.exports = authGuard