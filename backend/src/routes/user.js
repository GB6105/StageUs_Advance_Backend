const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../utils/validater")
const loginGuard = require("../utils/loginGuard")
const maria = require("../../database/connect/maria");

// 더미 데이터
const userData = [
    { name: "user1", id: "test1", pw: "test1111", age: 20, gender: "M", phone: "010-1111-1111", email: "test1@gmail.com", address: "Korea" },
    { name: "user2", id: "test2", pw: "test2222", age: 30, gender: "F", phone: "010-2222-2222", email: "test2@gmail.com", address: "Japan" },
    { name: "user3", id: "test3", pw: "test3333", age: 40, gender: "M", phone: "010-3333-3333", email: "test3@gmail.com", address: "Canada" }
];

//회원 가입 API v3
router.post("", validater("id"),validater("pw"),validater("name"),validater("gender"),validater("birthday"),validater("phone"),validater("email"),validater("address"),wrapper((req,res)=>{
    maria.query("INSERT INTO user (id, password, name,  gender, birthday, phone_number,email,address) VALUES(?,?,?,?,?,?,?,?)",
        [req.body.id, req.body.pw, req.body.name, req.body.gender, req.body.birthday, req.body.phone, req.body.email, req.body.address],(error, result) =>{
        if(error){
            return res.status(404).send({
                "message": error.sqlMessage
            })
        }else{
            res.status(200).send({
                "user_info":result[0],
                "message" : "회원가입에 성공하였습니다."
            })
        }    
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
    
    maria.query('SELECT password FROM user WHERE id = ?', [req.body.id],(error,result)=>{
        console.log(result)
        if(result.length>0 && result[0].password == req.body.pw){
            req.session.userid = req.body.id;
            return res.status(200).send({
                "user": req.session.userid,
                "message": req.session.userid + "로 로그인에 성공하였습니다."
            })
        }else{
            res.status(404).send({
                "message": "해당 사용자 정보를 찾을 수 없습니다."
            })
        }
    })
}))

//ID 찾기 v2
router.get("/find-id",validater("name"),validater("email"),wrapper((req,res)=>{

    maria.query('SELECT id FROM user WHERE name = ? AND email = ?',[req.body.name,req.body.email],(error,result)=>{
        if(result.length >0){
            res.status(200).send({
                "id":result[0].id,
                "message": `ID는 ${result[0].id} 입니다.`
            })
        }else{
            res.status(404).send({
                "message": "존재하지 않는 계정입니다."
            })
        }
    })
}))
        
//PW 찾기 
router.get("/find-pw",validater("id"),validater("name"),validater("email"),wrapper((req,res)=>{

    maria.query('SELECT password FROM user WHERE id =? AND name = ? AND email = ?',[req.body.id, req.body.name, req.body.email],(error,result)=>{
        console.log(result)
        if(result.length >0){
            res.status(200).send({
                "id":result[0].pw,
                "message": `PW는 ${result[0].password} 입니다.`
            })
        }else{
            res.status(404).send({
                "message": "존재하지 않는 계정입니다."
            })
        }
    })
}))
        
// 사용자 정보 확인 API 
router.get("/:id",loginGuard, wrapper((req,res)=>{
    const userId = req.session.userid;

    maria.query("SELECT * FROM user WHERE id = ?",[userId],(error,result)=>{
        if(error){
            return res.status(404).send({
                "message": error.sqlMessage
            })
        }else{
            res.status(200).send({
                "user_info" : result[0]
            })
        } 
    })
}))

//사용자 계정 정보 수정 API v2
router.patch("/:id",loginGuard,wrapper((req,res)=>{
    res.status(200).send({
        "message": "수정에 성공하였습니다."
    })
}))


router.put("/:id", validater("id"),validater("pw"),validater("name"),validater("phone"),validater("email"),validater("address"),wrapper((req,res)=>{
    const userId = req.session.userid;

    maria.query("UPDATE user SET id = ? , password = ?, name = ?, phone_number = ?, email = ?, address = ? WHERE id = ?",
        [req.body.id, req.body.pw, req.body.name,  req.body.phone, req.body.email, req.body.address, userId],(error, result) =>{
        if(error){
            return res.status(404).send({
                "message": error.sqlMessage
            })
        }else{
            res.status(200).send({
                "message" : "정보가 수정되었습니다."
            })
        }    
    })
    
}))

router.delete("/:id",loginGuard,wrapper((req,res)=>{
    const userId = req.session.userid;

    maria.query("DELETE FROM user WHERE id = ?",[userId],(error,result)=>{
        if(error){
            return res.status(404).send({
                "message": error.sqlMessage
            })
        }else{
            res.status(200).send({
                "message": "회원탈퇴가 완료되었습니다."
            })
        } 
    })
}))

module.exports = router;