const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const jwt = require("jsonwebtoken");

/**로그인 여부를 확인합니다. 유저 정보가 담긴 토큰을 요구합니다. */
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
//final 20250108
