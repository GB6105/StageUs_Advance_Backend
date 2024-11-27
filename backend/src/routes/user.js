const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../utils/validater")
const loginGuard = require("../utils/loginGuard")

// 더미 데이터
const userData = [
    { name: "user1", id: "test1", pw: "test1111", age: 20, gender: "M", phone: "010-1111-1111", email: "test1@gmail.com", address: "Korea" },
    { name: "user2", id: "test2", pw: "test2222", age: 30, gender: "F", phone: "010-2222-2222", email: "test2@gmail.com", address: "Japan" },
    { name: "user3", id: "test3", pw: "test3333", age: 40, gender: "M", phone: "010-3333-3333", email: "test3@gmail.com", address: "Canada" }
];

//회원 가입 API v3
router.post("", validater("name"),validater("id"),validater("pw"),validater("age"),validater("gender"),validater("phone"),validater("email"),validater("address"),wrapper((req,res)=>{
    res.status(200).send({
        "message" : "회원가입에 성a공하였습니다."
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
// router.get("",wrapper((req,res)=>{
//     const {id, pw} = req.body;
//     if(!id.match(regx.id)) throw customError("아이디가 올바르지 않습니다.", 401)
//     if(!pw.match(regx.pw)) throw customError("비밀번호가 올바르지 않습니다.", 401)
//     const checkId = userData.filter((data) =>data.id === id && data.pw === pw)  
//     if(checkId.length > 0){
//         req.session.userid = checkId[0].id; 
//         res.status(200).send({ 
//             "user": req.session.userid,
//             "message": `${req.session.userid}로 로그인에 성공하였습니다.`
//         })
//     }else{
//         res.status(401).send({
//             "message" : "아이디 혹은 비밀번호를 확인해주세요"
//         })
//     }
// }))

//로그인 API v2
router.get("",validater("id"),validater("pw"),wrapper((req,res)=>{
    req.session.userid = req.body.id;
    res.status(200).send({
        "user": req.session.userid,
        "message": req.session.userid + "로 로그인에 성공하였습니다."
    })

}))

//ID 찾기 v2
router.get("/find-id",validater("name"),validater("email"),wrapper((req,res)=>{

    const userResult = userData.filter((data) => data.name === req.body.name && data.email === req.body.email)
    if(!userResult || userResult.length === 0) throw customError("해당 사용자 정보를 찾을 수 없습니다.",404)
    const userResultId = userResult[0].id;

    res.status(200).send({
        "id":userResultId,
        "message": `ID는 ${userResultId} 입니다.`
    })

}))
        
//PW 찾기 
router.get("/find-pw",validater("id"),validater("name"),validater("email"),wrapper((req,res)=>{
    const userResult = userData.filter((data) => data.id === req.body.id && data.name === req.body.name && data.email === req.body.email)

    if(!userResult || userResult.length === 0) throw customError("해당 사용자 정보를 찾을 수 없습니다.",404)
    const userResultPw = userResult[0].pw;
    res.status(201).send({
            "pw":userResultPw,
            "message": `비밀번호는 ${userResultPw} 입니다.`
        })    
}))
        
// 사용자 정보 확인 API 
router.get("/:id",loginGuard, wrapper((req,res)=>{
    const userId = req.session.userid;
    res.status(201).send({
        "user": userId
    })
}))

//사용자 계정 정보 수정 API v2
router.patch("/:id",loginGuard,wrapper((req,res)=>{
    res.status(200).send({
        "message": "수정에 성공하였습니다."
    })
}))

router.delete("/:id",loginGuard,wrapper((req,res)=>{
    res.status(200).send({
        "message": "회원 탈퇴가 완료되었습니다."
    })
}))

module.exports = router;