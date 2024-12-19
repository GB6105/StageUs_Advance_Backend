// const customError = require("../utils/customError")
// const regx = require("../constants/regx")

// const validater = (field,regx)=>{
//     return (req,res,next)=>{
//         try{
//             const inputValue = req.body[field] || req.query[field] || req.param[field]
//             // console.log("입력값 검사 " + field + inputValue,"입력초기입니다.")
//             console.log(`입력값 검사 ${field} : ${inputValue} 입니다.`)
//             if(!inputValue || inputValue == "param") throw customError(`${field} 를 입력해주세요`, 400); // param 수정하기
//             if(!regx.test(inputValue)) throw customError(`${field} 의 형식이 올바르지 않습니다.`, 400)
//             next()
//         }catch(err){
//             res.status(err.statusCode || 500).send({
//                 "message":err.message
//             })
//         }
//     }
// }

// module.exports = validater

const customError = require("../utils/customError");
const regx = require("../constants/regx");
const wrapper = require("../utils/wrapper");

const validater = (field, regx) => {
    return wrapper((req, res, next) => {
        const inputValue = req.body[field] || req.query[field] || req.params[field]; // params로 수정
        console.log(`입력값 검사 ${field}: ${inputValue}`);
        if (!inputValue || inputValue === "param") {
            throw customError(`${field}를 입력해주세요.`, 400);
        }
        if (!regx.test(inputValue)) {
            throw customError(`${field}의 형식이 올바르지 않습니다.`, 400);
        }
        next(); // 검증 성공 시 다음 미들웨어로 넘어감
    });
};

module.exports = validater;
