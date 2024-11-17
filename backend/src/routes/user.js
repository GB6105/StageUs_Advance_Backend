const router = require("express").Router()
const customError = require("../utils/customError")


const userData = [
    { name: "user1", id: "test1", pw: "test1111", age: 20, gender: "M", phone: "010-1111-1111", email: "test1@gmail.com", address: "Korea" },
    { name: "user2", id: "test2", pw: "test2222", age: 30, gender: "F", phone: "010-2222-2222", email: "test2@gmail.com", address: "Japan" },
    { name: "user3", id: "test3", pw: "test3333", age: 40, gender: "M", phone: "010-3333-3333", email: "test3@gmail.com", address: "Canada" }
];

// router.post("",(req,res) => {
//     const nameRegex = /^[a-zA-Z가-힣0-9]{2,20}$/; //영어,한글 가능 2-20글자
//     const idRegex = /^[a-zA-Z0-9]{2,20}$/; // 영어, 숫자 가능 2-20글자
//     const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&]?).{8,16}$/; //영어 숫자 필수, 특수문자 옵션, 8-16글자
//     const ageRegex = /^[0-9]{1,2}$/;
//     const genderRegex = /^(M|F)$/; //M, F 만 가능;
//     const phoneRegex = /^010-[0-9]{4}-[0-9]{4}$/; // 010-xxxx-xxxx 가능
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const addressRegex = /^[A-Z][a-z]{1,}$/;
//     try{
//         const {name,id,pw,age,gender,phone,email,address} = req.body
//         if(!name||!id||!pw||!age||!gender||!phone||!email||!address)
//             {throw customError("모든 값을 입력해주십시오",400)}
        
//         for(let i = 0 ; i < req.body.length; i++){
//             checkValid()

//         }

//         if(!nameRegex.test(name))throw customError("이름이 올바르지 않습니다.",400)
//         const checkName = userData.filter((data) => data.name === name );
//         if(checkName.length > 0)throw customError("해당 정보로 가입된 계정이 존재합니다.",409)

//         if(!idRegex.test(id))throw customError("아이디가 올바르지 않습니다.",400)
//         const checkId= userData.filter((data) => data.id === id);
//         if(checkId.length > 0)throw customError("중복된 ID 입니다.",409)
            
//         if(!pwRegex.test(pw))throw customError("비밀번호가 올바르지 않습니다.",400)
//         if(!ageRegex.test(age))throw customError("나이가 올바르지 않습니다.",400)
//         if(!genderRegex.test(gender))throw customError("성별이 올바르지 않습니다.",400)
//         if(!phoneRegex.test(phone))throw customError("전화번호가 올바르지 않습니다.",400)

//         if(!emailRegex.test(email))throw customError("이메일주소가 올바르지 않습니다.",400)
//         const checkEmail = userData.filter((data) => data.email === email)
//         if(checkEmail.length > 0)throw customError("이미 가입된 email주소입니다.",409)
        
//         if(!addressRegex.test(address))throw customError("주소가 올바르지 않습니다.",400)
        
//         return res.status(200).send({
//             "message": "계정이 생성되었습니다."
//         })


//     }catch(err){
//         res.status(err.statusCode || 500).send({
//             "message": err.message
//         })
//     }
// })

router.post("",(req,res) => {
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

    //유효성 검사
    let checkValid = (type, inputValue) => {
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
        }
    }
    

    // Router
    try{
        const {name,id,pw,age,gender,phone,email,address} = req.body
        if(!name||!id||!pw||!age||!gender||!phone||!email||!address)
            {throw customError("모든 값을 입력해주십시오",400)}
        
        reqType.forEach((elem,) => {
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


module.exports = router;