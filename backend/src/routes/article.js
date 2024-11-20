const router = require("express").Router()
const customError = require("../utils/customError")

//게시글 더미 데이터
const article = [
    {"idx" : 1, "user_id": "test1", "title":"article1", "category_name" : "category1", "view":111, "content":"test article 1", "like": 11, "creat_at": "2024-11-11"},
    {"idx" : 2, "user_id": "test2", "title":"article2", "category_name" : "category2", "view":222, "content":"test article 2", "like": 22, "creat_at": "2024-11-22"},
    {"idx" : 3, "user_id": "test3", "title":"article3", "category_name" : "category3", "view":333, "content":"test article 3", "like": 33, "creat_at": "2024-11-33"}
]

//정규표현식
const regex = {
    nameRegex :/^[a-zA-Z가-힣0-9]{2,20}$/, //영어,한글 가능 2-20글자
    idRegex : /^[a-zA-Z0-9]{2,20}$/, // 영어, 숫자 가능 2-20글자
    pwRegex : /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&]?).{8,16}$/, //영어 숫자 필수, 특수문자 옵션, 8-16글자
    ageRegex : /^[0-9]{1,2}$/,
    genderRegex : /^(M|F)$/, //M, F 만 가능;
    phoneRegex : /^010-[0-9]{4}-[0-9]{4}$/, // 010-xxxx-xxxx 가능
    emailRegex : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    addressRegex : /^[A-Z][a-z]{1,}$/,
    titleRegex : /^[a-zA-Zㄱ-ㅎ가-힣0-9$@$!%*?&\s]{2,40}$/, // 영어,한글,숫자,특수문자 가능 2-40글자
    categoryRegex : /^(category1|category2|category3)$/, // 지정된 카테고리만 입력 가능
    contentRegex : /^[a-zA-Zㄱ-ㅎ가-힣0-9$@$!%*?&\s]{2,}$/ // 영어, 한글, 숫자, 특수문자 가능 2글자 이상 자유
}

let checkAndFind = (field,input) =>{

    if(!input) throw customError(`${field}를 입력해주세요`,400)

    const fieldRegex = regex[`${field}Regex`];
    // console.log(fieldRegex,"regex in function")
    // console.log(input,"input value in fuction")
    
    // 유효성 통과 실패 -> 함수 단계에서 thow error
    if(!fieldRegex.test(input))throw customError(`${field}의 형식이 올바르지 않습니다.`,400)
    
    //유효성 통과 성공 해당 값 탐색
    const result = article.filter((data) => data[field] === input)
    // console.log(result[0],"result fomr function")
    
    // 값 없음 -> false  반환 (회원 가입 가능 여부, 유저 정보 찾기(유저 없음))
    if(result.length === 0)return false // 유효성 통과 성공했지만 값 없음 -> false

    // 값 있음 -> 실제 값 반환 (중복 회원 방지, id,pw, 유저 정보 찾기(유저 있음))
    return result[0][field] // 유효성 통과 및 값 있음 -> 값 반환
}

// 로그인 여부 체크
let authCheck = (req) => {
    // if(!req.session.userid || req.session.userid === undefined) throw customError("잘못된 접근입니다. 로그인해주세요", 403);
    if(!req.session?.userid) throw customError("잘못된 접근입니다. 로그인해주세요", 403);
}

// 게시글 목록 불러오기 API
router.get("",(req,res) => {
    try{
        const page_number = req.query.page;
        console.log(req.session.userid)
        authCheck(req);

        if(!article || article.length === 0) throw customError("아직 게시글이 업습니다.",404)
        res.status(201).send({
            "article_list": article
        })
    }catch(err){
        res.status(err.status || 500).send({
            "messge" : err.message
        })
    }
})

// 게시글 작성 API
router.post("",(req,res) => {
    try{
        const {title, category_name, content} = req.body 
        const writer_id = req.session.userid;//로그인 안하고 api 호출시 에러 메시지 출력 안하는 문제가ㅋ
        authCheck(req);
        console.log("fien")
        //추후 forEach로 수정 해볼듯
        checkAndFind("title",title);
        checkAndFind("category",category_name);
        checkAndFind("content", content);
        
        // 값 승인 되면 데베로 등록
        res.status(200).send({
            "message": "게시글 작성이 완료되었습니다."
        })
    }catch(err){
        res.status(err.status || 500).send({

        })
    }
})

// 게시글 불러오기 API
router.get("/:idx",(req,res)=>{
    try{
        authCheck(req);
        const articleIdx = req.params.idx;
        const resultArticle = article.filter((article) => article.idx == articleIdx)
        if(!resultArticle || resultArticle.length === 0) throw customError("존재하지 않는 게시글 입니다.",404)
        res.status(201).send({
            "article" : resultArticle[0]
        })

    }catch(err){
        res.status(err.status || 500).send({
            "message" : err.message
        })
    }
})

//게시글 수정하기 API
router.patch("/:idx",(req,res)=>{
    try{
        authCheck(req);
        // 게시글 확인
        const articleIdx = req.params.idx;
        const resultArticle = article.filter((article) => article.idx == articleIdx)
        if(!resultArticle || resultArticle.length === 0) throw customError("존재하지 않는 게시글 입니다.",404)
        
        //게시글 수정
        const {title,category_name, content} = req.body
        checkAndFind("title", title)
        checkAndFind("category",category_name)
        checkAndFind("content",content)

        //DB로 게시글 수정값 올리기

        res.status(200).send({
            "message" : "게시글이 수정되었습니다."
        })
    }catch(err){
        res.status(err.status || 500).send({
            "message" : err.message
        })
    }
})

//게시글 삭제하기 API
router.delete("/:idx",(req,res)=>{
    try{
        authCheck(req);
        const articleIdx = req.params.idx;
        const resultArticle = article.filter((article) => article.idx == articleIdx)
        if(!resultArticle || resultArticle.length === 0) throw customError("존재하지 않는 게시글 입니다.",404)
        //DB 통해서 게시글 삭제 처리
        res.status(200).send({
            "message" : "게시글이 삭제되었습니다."
        })
    }catch(err){
        res.status(err.status || 500).send({
            "message" : err.message
        })
    }
})




module.exports = router;