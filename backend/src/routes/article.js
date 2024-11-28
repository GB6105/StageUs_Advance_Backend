const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../utils/validater")
const loginGuard = require("../utils/loginGuard")


//게시글 더미 데이터
const article = [
    {"idx" : 1, "user_id": "test1", "title":"article1", "category_name" : "category1", "view":111, "content":"test article 1", "like": 11, "creat_at": "2024-11-11"},
    {"idx" : 2, "user_id": "test2", "title":"article2", "category_name" : "category2", "view":222, "content":"test article 2", "like": 22, "creat_at": "2024-11-22"},
    {"idx" : 3, "user_id": "test3", "title":"article3", "category_name" : "category3", "view":333, "content":"test article 3", "like": 33, "creat_at": "2024-11-33"}
]

const user_like_data = [
    {"idx" : 1, "article_idx" : 1, "liked": 0 },
    {"idx" : 2, "article_idx" : 2, "liked": 1 },
    {"idx" : 3, "article_idx" : 3, "liked": 0 }
    
]


// 게시글 목록 불러오기 API
// router.get("",(req,res) => {
//     try{
//         const page_number = req.query.page;
//         console.log(req.session.userid)
//         authCheck(req);

//         if(!article || article.length === 0) throw customError("아직 게시글이 업습니다.",404)
//         res.status(201).send({
//             "article_list": article
//         })
//     }catch(err){
//         res.status(err.status || 500).send({
//             "messge" : err.message
//         })
//     }
// })

router.get("",loginGuard,wrapper((req,res)=>{
    const pageNumber = req.query.page;

    res.status(200).send({
        "article_list": "result"
    })

}))

// 게시글 작성 API
// router.post("",(req,res) => {
//     try{
//         const {title, category_name, content} = req.body 
//         const writer_id = req.session.userid;//로그인 안하고 api 호출시 에러 메시지 출력 안하는 문제가ㅋ
//         authCheck(req);
//         console.log("fien")
//         //추후 forEach로 수정 해볼듯
//         checkAndFind("title",title);
//         checkAndFind("category",category_name);
//         checkAndFind("content", content);
        
//         // 값 승인 되면 데베로 등록
//         res.status(200).send({
//             "message": "게시글 작성이 완료되었습니다."
//         })
//     }catch(err){
//         res.status(err.status || 500).send({

//         })
//     }
// })

router.post("",loginGuard,validater("title"),validater("category"),validater("content"),wrapper((req,res)=>{

    //DB처리 파트
    res.statu(200).send({
        "message": "게시글 작성이 완료되었습니다."
    })

}))

// 게시글 좋아요 해제
router.delete("/:idx/like/:likeidx",(req,res) => {
    //해당 게시글에 좋아요라는 속성을 추가(카테고리 느낌)
    try{
        authCheck(req);
        const like_ = req.body.liked;
        const recent_article_idx = req.params.idx;
        const recent_like = req.params.likeidx;
        console.log(recent_article_idx)
        console.log(result_like)

        //게시글 존재 여부 확인
        const result_article = article.filter((article) => article.idx == recent_article_idx)
        if(!result_article || result_article.length === 0) throw customError("존재하지 않는 게시글 입니다.",404)

        //게시글에 좋아요 여부 확인
        const result_like = user_like_data.filter((data) => data.article_idx == recent_article_idx) //db 조인이면 간편할듯
        if(result_like[0].liked == 1){
            res.status(200).send({
                "message":"게시글에 좋아요를 해제했습니다."
            })
        }
    }catch(err){
        res.status(err.status||500).send({
            "message": err.message
        })
    }
})

// 게시글 좋아요 추가
router.post("/:idx/like",(req,res) => {
    //해당 게시글에 좋아요라는 속성을 추가(카테고리 느낌)
    try{
        authCheck(req);
        const like = req.body.liked;

        //게시글 존재 여부 확인
        const recent_article_idx = req.params.idx;
        const result_article = article.filter((article) => article.idx == recent_article_idx)
        if(!result_article || result_article.length === 0) throw customError("존재하지 않는 게시글 입니다.",404)

        //게시글에 좋아요 여부 확인
        // const result_like = user_like_data.filter((data) => data[article_idx] == result_article.idx) //db 조인이면 간편할듯
        const result_like = user_like_data.filter((data) => data.article_idx == recent_article_idx) //db 조인이면 간편할듯
        if(like ==true && result_like[0].liked == 0){
            res.status(200).send({
                "message":"게시글에 좋아요를 남겼습니다."
            })
        }else{
            res.status(409).send({
                "message" : "이미 좋아요한 게시글 입니다."
            })
        }
    }catch(err){
        res.status(err.status||500).send({
            "message": err.message
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