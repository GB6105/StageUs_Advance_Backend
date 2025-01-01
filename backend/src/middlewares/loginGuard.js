const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const jwt = require("jsonwebtoken");

// const loginGuard = wrapper((req,res,next)=>{
//     // const id = req.session.userid
//     // if(!id) throw customError("잘못된 접근입니다. 로그인해주세요",401)
//     // next()
//     const {token} = req.headers
//     try{
//         req.decoded = jwt.verify(token,process.env.JWT_SIGNATURE_KEY)
//         next()
//     }catch(err){
//         if(err.message === "jwt must be provided") err.statusCode = 401;
//         if(err.message === "invalide token") err.statusCode = 401;
//         if(err.message === "jwt expired") err.statusCode = 401;
//         console.log(err.stack)

//         res.status(500).send({
//             "message":err.message
//         })
//     }
// })

const loginGuard = (req,res,next)=>{
    const {token} = req.headers
    try{
        req.decoded = jwt.verify(token,process.env.JWT_SIGNATURE_KEY)
        next()
    }catch(err){
        if(err.message === "jwt must be provided") err.statusCode = 401;
        if(err.message === "invalide token") err.statusCode = 401;
        if(err.message === "jwt expired") err.statusCode = 401;
        console.log(err.stack)

        res.status(err.statusCode || 500).send({
            "message":err.message
        })
    }
}
module.exports =loginGuard 