const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const regx = require("../constants/regx")

const validater = wrapper((req,res,next,field,input)=>{
    console.log("res in validity", res);
    if(!input) throw customError(`${field}를 입력해주세요`,400)
    const fieldRegx = regx[field];
    if(!fieldRegx.test(input))throw customError(`${field}의 형식이 올바르지 않습니다.`,400)
    next()
})
module.exports = validater
// let validater = (field,input,req,res) =>{
//     try{
//         if(!input) throw customError(`${field}를 입력해주세요`,400)
//         const fieldRegx = regx.field;
//         if(!fieldRegx.test(input))throw customError(`${field}의 형식이 올바르지 않습니다.`,400)

//     }catch(err){
//         res.status(err.statusCode || 500).send({
//             "message": err.message
//         })
        
//     }
// }

// let validater = (field,input) =>{

//     if(!input) throw customError(`${field}를 입력해주세요`,400)

//     const fieldRegx = regx.field;
     
//     // 유효성 통과 실패 -> 함수 단계에서 thow error
//     if(!fieldRegx.test(input))throw customError(`${field}의 형식이 올바르지 않습니다.`,400)
    
//     //유효성 통과 성공 해당 값 탐색
//     const result = article.filter((data) => data[field] === input)
//     // console.log(result[0],"result fomr function")
    
//     // 값 없음 -> false  반환 (회원 가입 가능 여부, 유저 정보 찾기(유저 없음))
//     if(result.length === 0)return false // 유효성 통과 성공했지만 값 없음 -> false

//     // 값 있음 -> 실제 값 반환 (중복 회원 방지, id,pw, 유저 정보 찾기(유저 있음))
//     return result[0][field] // 유효성 통과 및 값 있음 -> 값 반환
// }

// const validater = wrapper((req,res,input,field) => {
//     if(!input) throw customError(field+"를 입력해주세요",400)
//     const targetRegx = regx.field;
//     if(targetRegx.match(input))throw customError(field+"의 형식이 올바르지 않습니다.", 401);

// })
module.exports = validater