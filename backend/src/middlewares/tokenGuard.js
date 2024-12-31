const jwt = require("jsonwebtoken");

const tokenGuard = (req,res,next)=>{
    try{
        req.decoded = jwt.verify(req.headers, process.env.JWT_SIGNATURE_KEY)
        next();
    }catch(err){
        if(err.message === "jwt must be provided") err.statusCode = 401;

        console.log(err.stack)
        res.status(500).send({
            "message": err.message
        })
    }
}