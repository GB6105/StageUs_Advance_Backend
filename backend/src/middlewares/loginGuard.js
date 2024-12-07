const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")

const loginGuard = wrapper((req,res,next)=>{
    const id = req.session.userid
    if(!id) throw customError("잘못된 접근입니다. 로그인해주세요",401)
    next()
})
module.exports =loginGuard