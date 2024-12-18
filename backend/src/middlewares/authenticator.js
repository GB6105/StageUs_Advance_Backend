// const customError = require("../utils/customError")
// const wrapper = require("../utils/wrapper")

// const authenticator = wrapper((req,res,next)=>{
//     const id = req.session.userid
//     // 작성자 id 받아오기
//     if(!id) throw customError("권한이 없습니다.",401)
//     next()
// })
// module.exports =authenticator