const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const regx = require('../constants/regx')
const psql = require("../constants/psql")


//회원 가입 API v3
// router.post("", validater("id"),validater("pw"),validater("name"),validater("gender"),validater("birthday"),validater("phone"),validater("email"),validater("address"),wrapper((req,res)=>{
//     maria.query("INSERT INTO user (id, password, name,  gender, birthday, phone_number, email,address) VALUES(?,?,?,?,?,?,?,?)",
//         [req.body.id, req.body.pw, req.body.name, req.body.gender, req.body.birthday, req.body.phone, req.body.email, req.body.address],(error, result) =>{
//         if(error){
//             console.log(error.stack);
//             return res.status(404).send({
//                 "message": error.sqlMessage
//             })
//         }else{
//             res.status(200).send({
//                 "user_info":result[0],
//                 "message" : "회원가입에 성공하였습니다."
//             })
//         }    
//     })
//     //res.
// }))


//회원 가입 API
//wrapper 없이 구현현
// router.post("", validater("id",regx.id),validater("pw",regx.pw),validater("name",regx.name),validater("gender",regx.gender),validater("birthday",regx.birthday),validater("phone",regx.phone),validater("email",regx.email),validater("nation",regx.nation)
// ,async (req,res)=>{
//     const {id, pw, name, gender, birthday, phone, email, nation} = req.body;
//     try{
//         const signUpResult = await psql.query('INSERT INTO account.list (id, pw, name, gender, birthday, phone, email, nation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',[id,pw,name,gender,birthday,phone, email, nation])
//         if(signUpResult.rowCount > 0){
//             res.status(200).send({
//                 "message": "회원가입에 성공하였습니다."
//             })
//         }else{
//             res.status(500).send({
//                 "message": "알 수 없는 에러"
//             })
//         }
//     }catch(err){
//         res.status(409).send({
//             "message": err.message
//         })
//     }
// })

//wrapper를 async로 해서 구현
router.post("", validater("id",regx.id),validater("pw",regx.pw),validater("name",regx.name),validater("gender",regx.gender),validater("birthday",regx.birthday),validater("phone",regx.phone),validater("email",regx.email),validater("nation",regx.nation)
,wrapper(async (req,res)=>{
    const {id, pw, name, gender, birthday, phone, email, nation} = req.body;

    const signUpResult = await psql.query('INSERT INTO account.list (id, pw, name, gender, birthday, phone, email, nation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',[id,pw,name,gender,birthday,phone, email, nation])
    if(signUpResult.rowCount > 0){
        res.status(200).send({
            "message": "회원가입에 성공하였습니다."
        })
    }

}))

//로그인 API 

router.get("",validater("id",regx.id),validater("pw",regx.pw), wrapper(async (req,res)=>{
    const {id, pw} = req.body;
    const loginResult = await psql.query('SELECT * FROM account.list WHERE id = $1 AND pw = $2',[id,pw]).catch(err =>{
        console.error("query failed");
        throw err;
    })
    if(loginResult.rows.length > 0){
        req.session.userid = id;
        res.status(200).send({
            "message": req.session.userid + " 계정으로 로그인에 성공하였습니다."
        })
    }
    else{
        res.status(404).send({
            "message": "해당 계정이 존재하지 않습니다."
        })
    }
}))


// //ID 찾기 v2
router.get("/find-id",validater("name",regx.name),validater("email",regx.email),wrapper(async (req,res)=>{
    const {name, email} = req.body;
    const findIdResult = await psql.query("SELECT id FROM account.list WHERE name = $1 AND email = $2",[req.body.name,req.body.email])
    if(findIdResult.rows[0]){
        res.status(200).send({
            "message": "사용자 id는 " + findIdResult.rows[0].id + " 입니다."
        })
    }else{
        res.status(404).send({
            "message": "해당 사용자 정보를 찾을 수 없습니다.."
        })
    }
}))

// //PW 찾기 
router.get("/find-pw",validater("id",regx.id), validater("name",regx.name),validater("email",regx.email),wrapper(async (req,res)=>{
    const {id, name, email} = req.body;
    const findPwResult = await psql.query("SELECT pw FROM account.list WHERE id = $1 AND name = $2 AND email = $3",[req.body.id, req.body.name,req.body.email])
    if(findPwResult.rows[0]){
        res.status(200).send({
            "message": "사용자 비밀번호는 " + findPwResult.rows[0].pw + " 입니다."
        })
    }else{
        res.status(404).send({
            "message": "해당 사용자 정보를 찾을 수 없습니다.."
        })
    }
}))

        
// // 사용자 정보 확인 API 
// router.get("",loginGuard, wrapper((req,res)=>{
//     const userId = req.session.userid;

//     maria.query("SELECT * FROM user WHERE id = ?",[userId],(error,result)=>{
//         if(error){
//             return res.status(404).send({
//                 "message": error.sqlMessage
//             })
//         }else{
//             res.status(200).send({
//                 "user_info" : result[0]
//             })
//         }
//     })
// }))

// //사용자 계정 정보 수정 API v2
// // router.patch("/:id",loginGuard,wrapper((req,res)=>{
// //     res.status(200).send({
// //         "message": "수정에 성공하였습니다."
// //     })
// // }))


// router.put("", validater("id"),validater("pw"),validater("name"),validater("phone"),validater("email"),validater("address"),wrapper((req,res)=>{
//     const userId = req.session.userid;

//     maria.query("UPDATE user SET id = ? , password = ?, name = ?, phone_number = ?, email = ?, address = ? WHERE id = ?",
//         [req.body.id, req.body.pw, req.body.name,  req.body.phone, req.body.email, req.body.address, userId],(error, result) =>{
//         if(error){
//             return res.status(404).send({
//                 "message": error.sqlMessage
//             })
//         }else{
//             res.status(200).send({
//                 "message" : "정보가 수정되었습니다."
//             })
//         }    
//     })
    
// }))

// router.delete("",loginGuard,wrapper((req,res)=>{
//     const userId = req.session.userid;

//     maria.query("DELETE FROM user WHERE id = ?",[userId],(error,result)=>{
//         if(error){
//             return res.status(404).send({
//                 "message": error.sqlMessage
//             })
//         }else{
//             res.status(200).send({
//                 "message": "회원탈퇴가 완료되었습니다."
//             })
//         } 
//     })
// }))

module.exports = router;