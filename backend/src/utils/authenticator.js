const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")

const authenticator = wrapper((req,res,next)=>{
    const id = req.session.userid
    if(!id) throw customError("권한이 없습니다.",401)
    next()
})
module.exports =authenticator