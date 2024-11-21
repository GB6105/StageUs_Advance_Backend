const router = require("express").Router()
const customError = require("../utils/customError")

//게시글 더미 데이터
const article = [
    {"idx" : 1, "user_id": "test1", "title":"article1", "category_name" : "category1", "view":111, "content":"test article 1", "like": 11, "creat_at": "2024-11-11"},
    {"idx" : 2, "user_id": "test2", "title":"article2", "category_name" : "category2", "view":222, "content":"test article 2", "like": 22, "creat_at": "2024-11-22"},
    {"idx" : 3, "user_id": "test3", "title":"article3", "category_name" : "category3", "view":333, "content":"test article 3", "like": 33, "creat_at": "2024-11-33"}
]

const comment = [
    {"idx" : 1, "article_idx" : 1, "user_id": "test1","content": "comment1-1","creat_at": "2024-11-11"},
    {"idx" : 2, "article_idx" : 1, "user_id": "test2","content": "comment1-2","creat_at": "2024-11-22"},
    {"idx" : 3, "article_idx" : 1, "user_id": "test3","content": "comment1-3","creat_at": "2024-11-31"},
    {"idx" : 4, "article_idx" : 2, "user_id": "test1","content": "comment2-1","creat_at": "2024-12-12"},
    {"idx" : 5, "article_idx" : 2, "user_id": "test2","content": "comment2-2","creat_at": "2024-12-22"},
    {"idx" : 6, "article_idx" : 2, "user_id": "test3","content": "comment2-3","creat_at": "2024-12-31"}
]


//접근을 어떻게 할 것인지가 중요할 듯 (직접 유저 아이디 속성을 넣어서 비교를 해줄 것인지 DB구조상 join이나 연결된 형식을 사용할 것인지)
const user_comment_like_data =[
    {"idx" : 1, "user_id":"test1", "comment_idx" : 1, "liked": 0 },
    {"idx" : 2, "user_id":"test1", "comment_idx" : 2, "liked": 1 },
    {"idx" : 3, "user_id":"test1", "comment_idx" : 3, "liked": 0 }
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

//유효성 검사
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

//게시글 찾기 

let findArticle = (req) => {
    const article_idx = req.params.idx;
    const result_article = article.filter((article) => article.idx == article_idx)
    if(!result_article || result_article.length === 0) throw customError("존재하지 않는 게시글 입니다.",404)
    return result_article[0]
}

let findComment = (req) => {
    const recent_article = findArticle(req);
    const result_comment = comment.filter((comment) => comment.article_idx == recent_article.idx)
    if(!result_comment || result_comment.length === 0) throw customError("댓글이 존재하지 않습니다.",404)
    return result_comment
}

//댓글 좋아요 해제하기
router.delete("/:idx/comment/:commentidx/like/:likeidx",(req,res) => {
    try{
        authCheck(req);
        findArticle(req);
        findComment(req);

        const like = req.body.liked;
        
        const writer_id = req.session.userid;
        checkAndFind("id",writer_id);

        const recent_comment_idx = req.params.commentidx;
        const result = user_comment_like_data.filter((data) => data.comment_idx == recent_comment_idx && data.user_id == writer_id);
        if(!result || result.length === 0)throw customError("존재하지 않는 댓글 입니다.",404)
        console.log(result)
        

        if(result[0].liked == 1){
            //값 0으로 변경 
            res.status(200).send({
                "message": "댓글에 좋아요를 해제하였습니다."
            })
        }else{
            res.status(409).send({
                "message": "이미 해제된 좋아요입니다." // 굳이 필요한가?
            })
        }
    }catch(err){
        res.status(err.status||500).send({
            "message" : err.message
        })
    }
})

//댓글 좋아요 추가하기
router.post("/:idx/comment/:commentidx/like",(req,res) => {
    try{
        authCheck(req);
        findArticle(req);
        findComment(req);

        const like = req.body.liked;
        
        const writer_id = req.session.userid;
        checkAndFind("id",writer_id);

        const recent_comment_idx = req.params.commentidx;
        const result = user_comment_like_data.filter((data) => data.comment_idx == recent_comment_idx);
        if(!result || result.length === 0)throw customError("존재하지 않는 댓글 입니다.",404)
        console.log(result)
        

        if(result[0].liked == 0){
            //값 1로 변경
            res.status(200).send({
                "message": "댓글에 좋아요를 남겼습니다."
            })
        }else{
            res.status(409).send({
                "messgea": "이미 좋아요한 댓글입니다."
            })
        }
    }catch(err){
        res.status(err.status||500).send({
            "message" : err.message
        })
    }
})


//댓글 수정하기
router.put("/:idx/comment/:commentidx",(req,res) => {
    try{
        authCheck(req);
        findArticle(req);
        const commentData = findComment(req);
        
        const recent_comment_idx = req.params.commentidx;
        const content = req.body.content;
        const writer_id = req.session.userid;
        checkAndFind("content",content);
        checkAndFind("id",writer_id);
        
        const result = commentData.filter((data) => data.idx == recent_comment_idx);
        if(!result || result.length === 0)throw customError("존재하지 않는 댓글 입니다.",404)

            //DB 통해서 댓글 데이터 입력
        res.status(200).send({
            "message": "댓글이 수정되었습니다."
        })

    }catch(err){
        res.status(err.status||500).send({
            "message" : err.message
        })
    }
})

//댓글 삭제하기
router.delete("/:idx/comment/:commentidx",(req,res) => {
    try{
        authCheck(req);
        findArticle(req);
        const commentData = findComment(req);
        
        const recent_comment_idx = req.params.commentidx;
        const writer_id = req.session.userid;
        checkAndFind("id",writer_id);
        
        const result = commentData.filter((data) => data.idx == recent_comment_idx);
        if(!result || result.length === 0)throw customError("존재하지 않는 댓글 입니다.",404)

            //DB 통해서 댓글 데이터 입력
        res.status(200).send({
            "message": "댓글이 삭제되었습니다."
        })

    }catch(err){
        res.status(err.status||500).send({
            "message" : err.message
        })
    }
})

//게시글에 해당하는 댓글 불러오기
router.get("/:idx/comment",(req,res) => {

    try{
        authCheck(req);
        const result = findComment(req);
        res.send({
            "comment" : result,
            "message": "댓글 불러오기 성공"
        })

    }catch(err){
        res.status(err.status||500).send({
            "message" : err.message
        })
    }
})

//댓글 작성하기
router.post("/:idx/comment",(req,res) => {
    try{
        authCheck(req);
        findArticle(req);
        const content = req.body.content;
        const writer_id = req.session.userid;

        checkAndFind("content",content);
        checkAndFind("id",writer_id);

        //DB 통해서 댓글 데이터 입력
        res.status(200).send({
            "message": "댓글이 등록되었습니다."
        })

    }catch(err){
        res.status(err.status||500).send({
            "message" : err.message
        })
    }
})


module.exports = router;