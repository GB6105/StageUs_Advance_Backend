const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const regx = require("../constants/regx")

const validater = (field)=>{
    return (req,res,next)=>{
        try{
            const inputValue = req.body[field] || req.query[field] || req.param[field]
            console.log(inputValue,"입력초기입니다.")
            if(!inputValue || inputValue == "param") throw customError(`${field} 를 입력해주세요`, 400);
            const fieldRegx = regx[field];
            if(!fieldRegx.test(inputValue)) throw customError(field+"의 형식이 올바르지 않습니다.", 400)
            next()

        }catch(err){
            res.status(err.statusCode || 500).send({
                "message":err.message
            })
        }
    }

}

module.exports = validater
