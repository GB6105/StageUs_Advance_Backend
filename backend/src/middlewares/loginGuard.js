const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const jwt = require("jsonwebtoken");

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
