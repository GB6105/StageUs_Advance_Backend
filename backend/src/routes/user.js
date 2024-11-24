const router = require("express").Router()
const customError = require("../utils/customError")
const regx = require("../constants/regx")
const wrapper = require("../utils/wrapper")
const validater = require("../utils/validater")
const authenticator = require("../utils/authenticator")

// 더미 데이터
const userData = [
    { name: "user1", id: "test1", pw: "test1111", age: 20, gender: "M", phone: "010-1111-1111", email: "test1@gmail.com", address: "Korea" },
    { name: "user2", id: "test2", pw: "test2222", age: 30, gender: "F", phone: "010-2222-2222", email: "test2@gmail.com", address: "Japan" },
    { name: "user3", id: "test3", pw: "test3333", age: 40, gender: "M", phone: "010-3333-3333", email: "test3@gmail.com", address: "Canada" }
];

//유효성 검사 v1
// let checkValid = (type, inputValue) => {
//     if(!inputValue)throw customError("모든 값을 입력해주십시오",400)
//     const dynamicRegex = regex[`${type}Regex`] // object 변수 이름을 단순하게 작성하면 굳이 스트링으로 변환하지 않고 매개변수로 사용 가능
//     if(!dynamicRegex.test(inputValue))throw customError(`${type}이 올바르지 않습니다.`,400)
//     if(type === "id" || type === "name" || type === "email"){
//         const checkinputedValue = userData.filter((data) => data[type] === inputValue);
//         if(checkinputedValue.length > 0){
//             if(type === "id"){
//                 throw customError("중복된 ID 입니다.",409)
//             }else{
//                 throw customError("해당정보로 가입된 계정이 존재합니다.",409)
//             }
//         }
//     }
// }

/*
사용하고 싶은형태
chekcValid(name){
 자동으로 input인 name 하고 field의 name하고 비교 해주길 원함
}
let checkValid2 = (input) =>{
    const fieldRegex = regex[`${input}Regex`]
    const fieldType = field.filter((elem) => elem === input)
    if(!fieldRegex.test(fieldType)) throw customError(`${input}의 형식이 올바르지 않습니다.`, 400)
}
생각한건 input이 들어오면 input의 벨류대로 쓰고 input의 타입을 이름이로 사용하고 싶은데
*/
// 유효성 검사 함수 (검사만)v2
// let checkValid2 = (field, input) => {
//     const fieldRegex = regex[`${field}Regex`];
//     if(!fieldRegex.test(input)) throw customError("${field}의 형식이 올바르지 않습니다.",400)
//     return input;
// }

// 중복 값 찾기 함수 -> 값 찾기 함수 (중복값 있으면 해당 값을 반환 없으면 boolean 제공)
// 회원가입에서는 호출 후 값이 있으면 값을 받아서 값이 있음을 통해서 중지 (if 함수 is true) throw
// 값이 없으면 넘어감 -> false 반환 -> if 그냥 넘어감
// 로그인, id 에서는 값 찾아서 해당 값 반환
// let findElement = (field, input) => {
//     const result = userData.filter((data) => data[field] === input)
//     if(result){
//         return result
//     }else{
//         return false
//     }
// }

// 유효성 검사 및 값 찾기 통합 함수 //validater
// let checkAndFind = (field,input) =>{

//     if(!input) throw customError(`${field}를 입력해주세요`,400)

//     const fieldRegex = regex[`${field}Regex`];
//     // console.log(fieldRegex,"regex in function")
//     // console.log(input,"input value in fuction")
    
//     // 유효성 통과 실패 -> 함수 단계에서 thow error
//     if(!fieldRegex.test(input))throw customError(`${field}의 형식이 올바르지 않습니다.`,400)
    
//     //유효성 통과 성공 해당 값 탐색
//     const result = userData.filter((data) => data[field] === input)
//     // console.log(result[0],"result fomr function")
    
//     // 값 없음 -> false  반환 (회원 가입 가능 여부, 유저 정보 찾기(유저 없음))
//     if(result.length === 0)return false // 유효성 통과 성공했지만 값 없음 -> false

//     // 값 있음 -> 실제 값 반환 (중복 회원 방지, id,pw, 유저 정보 찾기(유저 있음))
//     return result[0][field] // 유효성 통과 및 값 있음 -> 값 반환
// }


// 회원 가입 API v1
// router.post("",(req,res) => {
//     try{       
//         reqType.forEach((elem) => checkValid(elem,req.body[elem]))
//         return res.status(200).send({
//             "message": "계정이 생성되었습니다."
//         })
//     }catch(err){
//         res.status(err.statusCode || 500).send({
//             "message": err.message
//         })
//     }
// })

// 회원 가입 API v2
router.post("",wrapper((req,res)=>{
    const {name, id, pw, age, gender, phone, email, address} = req.body;
    if(!name.match(regx.name)) throw customError("이름이 양식에 맞지 않습니다.",401)
    if(!id.match(regx.id)) throw customError("ID가 양식에 맞지 않습니다.",401)
    if(!pw.match(regx.pw)) throw customError("PW가 양식에 맞지 않습니다.",401)
    if(!age.match(regx.age)) throw customError("나이가 양식에 맞지 않습니다.",401)
    if(!gender.match(regx.gender)) throw customError("성별이 양식에 맞지 않습니다.",401)
    if(!phone.match(regx.phone)) throw customError("전화번호가 양식에 맞지 않습니다.",401)
    if(!email.match(regx.email)) throw customError("email이 양식에 맞지 않습니다.",401)
    if(!address.match(regx.address)) throw customError("주소가 양식에 맞지 않습니다.",401)
    
    res.status(200).send({
        "message" : "회원가입에 성공하였습니다."
    })
}))

// 로그인 API
// router.get("",(req,res) => {
//     const {id, pw} = req.body;
//     try{
//         if(!regex["idRegex"].test(id))throw customError("아이디가 올바르지 않습니다.", 400)
//         if(!regex["pwRegex"].test(pw))throw customError("비밀번호가 올바르지 않습니다.", 400)
//         const checkId = userData.filter((data) =>data.id === id && data.pw === pw)  
//         if(checkId != ""){
//             req.session.userid = checkId[0].id; // 유저 아이디만 세션에 저장
//             return res.status(200).send({ // 함수를 끝낸는 기능이 없는 send 이므로 return 해주여야함 (그걸 이용해서 나눠서 응답만 보내고 하기도함) 여기서 return피료없음
//                 "user": req.session.userid,
//                 "message": `${req.session.userid}로 로그인에 성공하였습니다.`
//             })
//         }else{
//             throw customError("해당 사용자 정보를 찾을 수 없습니다.",404);
//         }

//     }catch(err){
//         res.status(err.status || 500).send({
//             "message": err.message
//         })
//     }
// })

//로그인 API v2
router.get("",wrapper((req,res)=>{
    const {id, pw} = req.body;
    if(!id.match(regx.id)) throw customError("아이디가 올바르지 않습니다.", 401)
    if(!pw.match(regx.pw)) throw customError("비밀번호가 올바르지 않습니다.", 401)
    const checkId = userData.filter((data) =>data.id === id && data.pw === pw)  
    if(checkId.length > 0){
        req.session.userid = checkId[0].id; 
        res.status(200).send({ 
            "user": req.session.userid,
            "message": `${req.session.userid}로 로그인에 성공하였습니다.`
        })
    }else{
        res.status(401).send({
            "message" : "아이디 혹은 비밀번호를 확인해주세요"
        })
    }
}))

//ID 찾기
// router.get("/find-id",(req,res)=>{
//     try{
//         const {name, email} = req.body;

//         // 값에 대해서 유효성 검사 진행
//         const checkName = checkAndFind("name",name)
//         const checkEmail = checkAndFind("email",email)

//         // 값이 해당 정보에 있는 지 확인
//         const userResult = userData.filter((data) => data.name === checkName && data.email === checkEmail)

//         if(!userResult || userResult.length === 0) throw customError("해당 사용자 정보를 찾을 수 없습니다.",404)
//         const userResultId = userResult[0].id;
//         res.status(201).send({
//                 "id":userResultId,
//                 "message": `ID는 ${userResultId} 입니다.`
//             })             
//     }catch(err){
//         res.status(err.status || 500).send({
//             "message" : err.message
//         })
//     }
            
// })

//ID 찾기 v2
router.get("/find-id",wrapper((req,res)=>{
    const {name, email} = req.body;
    validater("name", name);
    validater("email", email);

    // const userResult = userData.filter((data) => data.name === name && data.email === email)
    // if(!userResult || userResult.length === 0) throw customError("해당 사용자 정보를 찾을 수 없습니다.",404)
    // const userResultId = userResult[0].id;
    res.status(200).send({
        "id":userResultId,
        "message": `ID는 ${userResultId} 입니다.`
    })  

    
}))
        
// 사용자 PW 찾기
router.get("/find-pw",(req,res) => {
    try{
        const {id, name, email} = req.body;

        // 값에 대해서 유효성 검사 진행
        const checkId = checkAndFind("id",id)
        const checkName = checkAndFind("name",name)
        const checkEmail = checkAndFind("email",email)

        // 값이 해당 정보에 있는 지 확인
        const userResult = userData.filter((data) => data.id === checkId && data.name === checkName && data.email === checkEmail)

        if(!userResult || userResult.length === 0) throw customError("해당 사용자 정보를 찾을 수 없습니다.",404)
        const userResultPw = userResult[0].pw;
        res.status(201).send({
                "pw":userResultPw,
                "message": `비밀번호는 ${userResultPw} 입니다.`
            })             
    }catch(err){
        res.status(err.status || 500).send({
            "message" : err.message
        })
    }
            
})
        
// 사용자 정보 확인 API (본인 정보는 아무것도 피요없음)
router.get("/:id",(req,res) =>{ //:id 없는게 맞음
    try{    
        if(req.session.userid === req.params.id){ // 필요없는 부분 -> 세션만 있으면 다 가능
            const findUser = userData.filter((data) => data.id === req.params.id)
            res.status(201).send({
                "user" : findUser[0]
            })
        }else{ // 필요없는 부분 -> 세션이 없을 때 안된다는 오류 구문정도는 추가해주면 됨
            throw customError("해당 계정(게터) 정보를 찾을 수 없습니다.",404) 
        }

    }catch(err){
        res.status(err.status || 500).send({
            "message" : err.message
        })
    }    
})

// 사용자 계정 정보 수정

router.patch("/:id",(req,res) => {
    try{
        if(req.session.userid == "" || req.session.userid !== req.params.id){
            throw customError("잘못된 접근입니다. 로그인 후 사용해주세요",403);
        }else{
            const {name, id, pw, gender, phone, email, address } = req.body;
            res.status(200).send({
                "message": "성공"
            })
        }

        // 로그인 모듈 첨가해주기

    }catch(err){
        res.status(err.status || 500).send({
            "message":err.message
        })
    }
})


// 사용자 정보 삭제
router.delete("/:id", (req,res) => {
    try{
        if(req.session.userid == "" || req.session.userid !== req.params.id){
            throw customError("잘못된 접근입니다. 로그인 후 사용해주세요",403);
        }else{
            // DB 연결후 DB에서 해당 유저 정보 삭제
            res.status(200).send({
                "message": "회원 탈퇴가 완료되었습니다."
            })
        }
    }catch(err){
        res.status(err.status || 500).send({
            "message" : err.message
        })
    }
})
    
module.exports = router;