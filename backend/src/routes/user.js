const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")                          
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const authGuard = require("../middlewares/authGuard")
const regx = require('../constants/regx')
const psql = require("../constants/psql")
const jwt = require("jsonwebtoken")

//회원 가입 API v3
router.post("", 
    validater([
        {field: "id", regx: regx.id},
        {field: "pw", regx: regx.pw},
        {field: "name", regx: regx.name},
        {field: "gender", regx: regx.gender},
        {field: "birthday", regx: regx.birthday},
        {field: "phone", regx: regx.phone},
        {field: "email", regx: regx.email},
        {field: "nation", regx: regx.nation},
    ]),
    wrapper(async (req,res)=>{
        const {id, pw, name, gender, birthday, phone, email, nation} = req.body;

        const signUpResult = await psql.query('INSERT INTO account.list (id, pw, name, gender, birthday, phone, email, nation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',[id,pw,name,gender,birthday,phone, email, nation])
        if(signUpResult.rowCount > 0){
            const banTable = await psql.query('INSERT INTO account.isBanned (account_id, ban) VALUES($1, $2)',[id,"F"])
            res.status(200).send({
                "message": "회원가입에 성공하였습니다."
            })
        }
    }
))

//로그인 API 
router.get("",
    validater([
        {field: "id", regx: regx.id},
        {field: "pw", regx: regx.pw}
    ]),
    wrapper(async (req,res)=>{
    // console.log(req)
    // console.log(req.method)
    // console.log(req.url)
    const {id, pw} = req.body;
    const loginResult = await psql.query('SELECT * FROM account.list WHERE id = $1 AND pw = $2',[id,pw]).catch(err =>{
        console.error("query failed");
        throw err;
    })
    console.log("로그인 계정 권한:",loginResult.rows[0].role);
    if(loginResult.rows.length > 0){
        //
        //req.session.userid = id;
        //req.session.userRole = loginResult.rows[0].role
        
        //
        const accessToken = jwt.sign({
            "userId" : id,
            "password" : pw,
            "userRole" : loginResult.rows[0].role
        },process.env.JWT_SIGNATURE_KEY,{
            "issuer": "gb6105",
            "expiresIn" : "30m",
        })
        
        const refreshToken = jwt.sign({
            "userId":id,
            "password" : pw,
            "userRole" : loginResult.rows[0].role
        },process.env.JWT_SIGNATURE_KEY,{
            "issuer":"gb6105",
            "expiresIn":"1M",
        })

        res.status(200).send({
            "message": id + " 계정으로 로그인에 성공하였습니다.",
            "accessToken" : accessToken,
            "refreshToken" : refreshToken
        })
    }
    else{
        res.status(404).send({
            "message": "해당 계정이 존재하지 않습니다."
        })
    }
}))

// ID 찾기 v2
router.get("/find-id",
    validater([
        {field: "name", regx: regx.name},
        {field: "email", regx: regx.email},
    ]),
    wrapper(async (req,res)=>{
    const {name, email} = req.body;
    const findIdResult = await psql.query("SELECT id FROM account.list WHERE name = $1 AND email = $2",[name, email])
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

// PW 찾기 
router.get("/find-pw",
    validater([
        {field: "id", regx: regx.id},
        {field: "name", regx: regx.name},
        {field: "email", regx: regx.email},
    ]),
    wrapper(async (req,res)=>{
    const {id, name, email} = req.body;
    const findPwResult = await psql.query("SELECT pw FROM account.list WHERE id = $1 AND name = $2 AND email = $3",[id,name,email])
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
        
// 사용자 정보 확인 API 
router.get("/my",
    loginGuard,
    wrapper(async (req,res)=>{
    // const userId = req.session.userid;
    // const userInfo = await psql.query("SELECT * FROM account.list WHERE id = $1",[userId])
    // console.log(userId);
    // console.log(userInfo)
    
    //token을 통한 인증으로 교체
    const {userId} = req.decoded;
    console.log(userId)
    const userInfo = await psql.query("SELECT * FROM account.list WHERE id = $1",[userId])
    
    res.status(200).send({
        "userInfo":userInfo.rows[0] 
    })
}))


// 사용자 계정 정보 수정 API
router.put("/my",
    loginGuard,
    validater([
        {field: "id", regx: regx.id},
        {field: "pw", regx: regx.pw},
        {field: "name", regx: regx.name},
        {field: "gender", regx: regx.gender},
        {field: "birthday", regx: regx.birthday},
        {field: "phone", regx: regx.phone},
        {field: "email", regx: regx.email},
        {field: "nation", regx: regx.nation},
    ]),
    wrapper(async (req,res)=>{

    //const userId = req.session.userid;
    const {id,pw,name,gender,birthday,phone,email,nation} = req.body;
    
    const {userId} = req.decoded;
    const userInfoEdit = await psql.query("UPDATE account.list SET id = $1 , pw = $2, name = $3, gender = $4, birthday = $5, phone = $6, email = $7, nation = $8 WHERE id = $9",[id, pw, name, gender, birthday, phone, email, nation, userId])
    //const userInfoEdit = await psql.query("UPDATE account.list SET pw = $1, name = $2, gender = $3, birthday = $4, phone = $5, email = $6, nation = $7 WHERE id = $8",[pw, name, gender, birthday, phone, email, nation, userId])

    if(userInfoEdit.rowCount > 0){
        res.status(200).send({
            "message": "회원정보 수정이 완료되었습니다."
        })
    }
}))
                
// 사용자 정보 삭제 (회원탈퇴)
router.delete("/my",loginGuard, wrapper(async (req,res)=>{
    //const userId = req.session.userid;
    const {userId} = req.decoded;
    console.log(userId);
    const userbantableDelete = await psql.query("DELETE FROM account.isbanned WHERE account_id = $1",[userId])
    const userDeleteResult = await psql.query("DELETE FROM account.list WHERE id = $1",[userId]).catch(err=>{
        console.error(err.message);
        throw err;
    })
    if(userDeleteResult.rowCount > 0){
        res.status(200).send({
            "message": "회원 탈퇴가 완료되었습니다."
        })
    }
}))

module.exports = router;