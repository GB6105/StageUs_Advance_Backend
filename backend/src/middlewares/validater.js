const customError = require("../utils/customError");
const regx = require("../constants/regx");
const wrapper = require("../utils/wrapper");

// const validater = (field, regx) => {
//     return wrapper((req, res, next) => {
//         const inputValue = req.body[field] || req.query[field] || req.params[field]; // params로 수정
//         console.log(`입력값 검사 ${field}: ${inputValue}`);
//         // if (!inputValue || inputValue === "param") {
//         if (!inputValue ) {
//             throw customError(`${field}를 입력해주세요.`, 400);
//         }
//         if (!regx.test(inputValue)) {
//             throw customError(`${field}의 형식이 올바르지 않습니다.`, 400);
//         }
//         next(); // 검증 성공 시 다음 미들웨어로 넘어감
//     });
// };

const validater = (fields) => {
    return wrapper((req, res, next) => {
        for (const {field, regx} of fields){
            const inputValue = req.body[field] || req.query[field] || req.params[field]; // params로 수정
            console.log(`입력값 검사 ${field}: ${inputValue}`);
            // if (!inputValue || inputValue === "param") {
            if (!inputValue ) {
                throw customError(`${field}를 입력해주세요.`, 400);
            }
            if (!regx.test(inputValue)) {
                throw customError(`${field}의 형식이 올바르지 않습니다.`, 400);
            }
        }
        next(); // 검증 성공 시 다음 미들웨어로 넘어감
    });
};

module.exports = validater;
// final 20250108