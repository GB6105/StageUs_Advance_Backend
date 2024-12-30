const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const jwt = require("jsonwebtoken");

const loginGuard = wrapper((req,res,next)=>{
    // const id = req.session.userid
    // if(!id) throw customError("잘못된 접근입니다. 로그인해주세요",401)
    // next()

    // const {token} = req.headers
    // req.decoded = jwt.verify(token,process.env.JWT_SIGNATURE_KEY)
    // if()
    // next()

})
module.exports =loginGuard