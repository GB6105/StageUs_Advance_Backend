const router = require("express").Router()
const customError = require("../utils/customError")


const userData = [
    { name: "user1", id: "test1", pw: "test1111", age: 20, gender: "M", phone: "010-1111-1111", email: "test1@gmail.com", address: "Korea" },
    { name: "user2", id: "test2", pw: "test2222", age: 30, gender: "F", phone: "010-2222-2222", email: "test2@gmail.com", address: "Japan" },
    { name: "user3", id: "test3", pw: "test3333", age: 40, gender: "M", phone: "010-3333-3333", email: "test3@gmail.com", address: "Canada" }
];

// 정규표현식
const regex = {
    nameRegex :/^[a-zA-Z가-힣0-9]{2,20}$/, //영어,한글 가능 2-20글자
    idRegex : /^[a-zA-Z0-9]{2,20}$/, // 영어, 숫자 가능 2-20글자
    pwRegex : /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&]?).{8,16}$/, //영어 숫자 필수, 특수문자 옵션, 8-16글자
    ageRegex : /^[0-9]{1,2}$/,
    genderRegex : /^(M|F)$/, //M, F 만 가능;
    phoneRegex : /^010-[0-9]{4}-[0-9]{4}$/, // 010-xxxx-xxxx 가능
    emailRegex : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    addressRegex : /^[A-Z][a-z]{1,}$/
}

const reqType =["name","id","pw","age","gender","phone","email","address"]


let findElement = (type,value) =>{
    const checker = userData.filter((data) => data[type] === value)
    return checker;
}
//유효성 검사
let checkValid = (type, inputValue) => {
    if(!inputValue)throw customError("모든 값을 입력해주십시오",400)
    const dynamicRegex = regex[`${type}Regex`]
    if(!dynamicRegex.test(inputValue))throw customError(`${type}이 올바르지 않습니다.`,400)
    if(type === "id" || type === "name" || type === "email"){
        const checkinputedValue = userData.filter((data) => data[type] === inputValue);
        if(checkinputedValue.length > 0){
            if(type === "id"){
                throw customError("중복된 ID 입니다.",409)
            }else{
                throw customError("해당정보로 가입된 계정이 존재합니다.",409)
            }
        }
        // if(findElement(userData,inputValue).length > 0){
        //     if(type === "id"){
        //         throw customError("중복된 ID 입니다.",409)
        //     }else{
        //         throw customError("해당정보로 가입된 계정이 존재합니다.",409)
        //     }
        // }
    }
}

//회원 가입 API
router.post("",(req,res) => {
    try{       
        reqType.forEach((elem) => {
            checkValid(elem,req.body[elem])
        })

        return res.status(200).send({
            "message": "계정이 생성되었습니다."
        })

    }catch(err){
        res.status(err.statusCode || 500).send({
            "message": err.message
        })
    }
})

// 로그인 API
router.get("",(req,res) => {
    const {id, pw} = req.body;
    try{
        if(!regex["idRegex"].test(id))throw customError("아이디가 올바르지 않습니다.", 400)
        if(!regex["pwRegex"].test(pw))throw customError("비밀번호가 올바르지 않습니다.", 400)
        const checkId = userData.filter((data) =>data.id === id && data.pw === pw)  
        if(checkId != ""){
            req.session.userid = checkId[0].id; // 유저 아이디만 세션에 저장
            return res.status(200).send({
                "user": req.session.userid,
                "message": `${req.session.userid}로 로그인에 성공하였습니다.`
            })
        }else{
            throw customError("해당 사용자 정보를 찾을 수 없습니다.",404);
        }

    }catch(err){
        res.status(err.status || 500).send({
            "message": err.message
        })
    }
})

// 사용자 정보 확인 API
router.get("/:id",(req,res) =>{
    try{    
        if(req.session.userid === req.params.id){
            const findUser = userData.filter((data) => data.id === req.params.id)
            res.status(201).send({
                "user" : findUser[0]
            })
        }else{
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

// 사용자 ID 찾기
router.get("/find-id",(req,res)=>{
    try{
        const {name, email} = req.body;
        res.send({
            "message": "성공"
        })
        // checkValid(name,req.body[name])
        // checkValie(email,req.body[email])
        //req.body.forEach((elem) => checkValid(elem,req.body[elem]))
        // const checkId = userData.filter((data) => data.name === name && data.email === email)
        // console.log(checkId)  
        // if(checkId ){
        //     res.status(201).send({
        //         "id":checkId[0].id,
        //         "message": `ID는 ${checkId[0].id} 입니다.`
        //     })
        // }else{
        //     throw customError("해당 사용자 정보를 찾을 수 없습니다.",404)
        // }

    }catch(err){
        res.status(err.status || 500).send({
            "message" : err.message
        })
    }

})

// 사용자 PW 찾기
router.get("/find-pw",(req,res) => {

})


module.exports = router;