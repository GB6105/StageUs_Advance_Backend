const router = require("express").Router()
const customError = require("../utils/customError")
const regex = require("../constants/regx")
const wrapper = require("../utils/wrapper")
const validater = require("../utils/validater")
const authenticator = require("../utils/authenticator")
const mysql = require("../../database/connect/mysql");
const loginGuard = require("../utils/loginGuard")

//게시글 더미 데이터
// const article = [
//     {"idx" : 1, "user_id": "test1", "title":"article1", "category_name" : "category1", "view":111, "content":"test article 1", "like": 11, "creat_at": "2024-11-11"},
//     {"idx" : 2, "user_id": "test2", "title":"article2", "category_name" : "category2", "view":222, "content":"test article 2", "like": 22, "creat_at": "2024-11-22"},
//     {"idx" : 3, "user_id": "test3", "title":"article3", "category_name" : "category3", "view":333, "content":"test article 3", "like": 33, "creat_at": "2024-11-33"}
// ]

// const comment = [
//     {"idx" : 1, "article_idx" : 1, "user_id": "test1","content": "comment1-1","creat_at": "2024-11-11"},
//     {"idx" : 2, "article_idx" : 1, "user_id": "test2","content": "comment1-2","creat_at": "2024-11-22"},
//     {"idx" : 3, "article_idx" : 1, "user_id": "test3","content": "comment1-3","creat_at": "2024-11-31"},
//     {"idx" : 4, "article_idx" : 2, "user_id": "test1","content": "comment2-1","creat_at": "2024-12-12"},
//     {"idx" : 5, "article_idx" : 2, "user_id": "test2","content": "comment2-2","creat_at": "2024-12-22"},
//     {"idx" : 6, "article_idx" : 2, "user_id": "test3","content": "comment2-3","creat_at": "2024-12-31"}
// ]

// //접근을 어떻게 할 것인지가 중요할 듯 (직접 유저 아이디 속성을 넣어서 비교를 해줄 것인지 DB구조상 join이나 연결된 형식을 사용할 것인지)
// const user_comment_like_data =[
//     {"idx" : 1, "user_id":"test1", "comment_idx" : 1, "liked": 0 },
//     {"idx" : 2, "user_id":"test1", "comment_idx" : 2, "liked": 1 },
//     {"idx" : 3, "user_id":"test1", "comment_idx" : 3, "liked": 0 }
// ]

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
router.delete("/:commentidx/like/:likeidx",(req,res) => {
    try{
        //authCheck(req);
        findArticle(req);
        findComment(req);

        const like = req.body.liked;
        
        const writer_id = req.session.userid;
        checkAndFind("id",writer_id);// 세션 값은 믿을 수 있는 데이터 이므로 유효성 검사 필요 없음

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
router.post("/:commentidx/like",(req,res) => {
    try{

        //body로 게시글 idx 받아오셈
        //authCheck(req);
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
router.put("/:commentidx",(req,res) => {
    try{
       // authCheck(req);
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
router.delete("/:commentidx",(req,res) => {
    try{
        //authCheck(req);
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
        //authCheck(req);
        //body로 article idx를 받아와도 됨 
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
//router.post("",(req,res) => {
//
//     try{
//         //authCheck(req);
//         findArticle(req);
//         const content = req.body.content;
//         const writer_id = req.session.userid;
        
//         checkAndFind("content",content);
//         checkAndFind("id",writer_id);
        
//         //DB 통해서 댓글 데이터 입력
//         res.status(200).send({
//             "message": "댓글이 등록되었습니다."
//         })
        
//     }catch(err){
//         res.status(err.status||500).send({
//             "message" : err.message
//         })
//     }
// })


router.post("",loginGuard,validater("content"),wrapper(async (req,res)=>{
        try{
            const postid = req.body.postid;
            const userid = req.session.userid;
            const sql = "INSERT INTO comment (post_idx, user_idx, content) VALUES(?,?,?)";
            const values = [postid,userid,req.body.content];
        
            const [result] = await mysql.query(sql, values);
            res.status(200).send({
                "message": "댓글이 등록되었습니다."
            })
        }catch(err){
            res.send({
                "message": err.message
            })
        }
    }

))

module.exports = router;