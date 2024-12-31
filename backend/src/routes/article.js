const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const authGuard = require("../middlewares/authGuard")
const banGuard = require("../middlewares/banGuard")
const regx = require('../constants/regx')
const psql = require("../constants/psql")
const {articleNotfoundMiddleware} = require("../middlewares/errorhandler")

// 게시글 목록 불러오기 API
router.get("", loginGuard, wrapper(async (req,res)=>{
    const articleList = await psql.query("SELECT title, user_id FROM article.list")
    if(articleList.rows.length>0){
        res.status(200).send({
            "article_list": articleList.rows[0]
        })
    }
}))

// 게시글 작성 API (벤 유저 금지)
router.post("",loginGuard, banGuard, validater("title",regx.title),validater("category",regx.category),validater("content",regx.content),wrapper(async (req,res)=>{
    const {title, category, content} = req.body;
    // const userid = req.session.userid;
    const {userId} = req.decoded;

    const writeAritcle = await psql.query("INSERT INTO article.list (writer_id, title, category_name,content) VALUES ($1,$2,$3,$4)",[userId,title,category,content])
    if(writeAritcle.rowCount > 0){
        res.status(200).send({
            "message" : "게시글 작성이 완료되었습니다."
        })
    }
}))

// 게시글 좋아요 해제
router.delete("/:idx/like",loginGuard, banGuard, articleNotfoundMiddleware, wrapper(async (req,res)=>{
    const articleIdx = req.params.idx;
    // const userid = req.session.userid;
    const {userId} = req.decoded;

    const likeDrop = await psql.query("DELETE FROM article.like WHERE article_idx = $1 AND account_id = $2",[articleIdx,userId])
    if(likeDrop.rowCount > 0){
        res.status(200).send({
            "message": "해당 글을 좋아요 해제하였습니다."
        })
    }else{
        res.status(400).send({
            "message":  "이미 좋아요 해제한 게시글 입니다."
        })
    }
}))

// 게시글 좋아요 추가
router.post("/:idx/like",loginGuard,banGuard, articleNotfoundMiddleware, wrapper(async (req,res)=>{
    const articleIdx = req.params.idx;
    const userid = req.session.userid;
    const likeAdd = await psql.query("INSERT INTO article.like (article_idx,account_id) VALUES ($1, $2) ON CONFLICT (article_idx, account_id) DO NOTHING",[articleIdx,userid])
    if(likeAdd.rowCount > 0){
        res.status(200).send({
            "message": "해당 글을 좋아요에 추가하였습니다."
        })
    }else{
        res.status(400).send({
            "message":  "이미 좋아요한 게시글 입니다."
        })
    }

}))

// 게시글 불러오기 API (벤 유저 금지)
router.get("/:idx", loginGuard, banGuard, articleNotfoundMiddleware, wrapper(async (req,res)=>{
    const articleIdx = req.params.idx;
    const getArticle = await psql.query("SELECT * FROM article.list WHERE idx = $1",[articleIdx])
    if(getArticle.rows.length > 0){
        res.status(200).send({
            "article" : getArticle.rows[0]
        })
    }
}))

//게시글 수정하기 API (벤 유저 금지) (본인 확인)
router.patch("/:idx",
    loginGuard,
    banGuard,
    validater("title",regx.title),
    validater("category",regx.category),
    validater("content",regx.content),
    articleNotfoundMiddleware,
    wrapper(async (req,res)=>{
    // const userid = req.session.userid
    const {userId} = req.decoded;

    const articleIdx = req.params.idx
    const {title, category, content} = req.body;
    const articlePatch = await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 WHERE idx = $4 AND writer_id = $5",[title, category, content, articleIdx,userId])
    if(articlePatch.rowCount > 0){
        res.status(200).send({
            "message": "게시글이 수정되었습니다."
        })
    }else{
        res.status(401).send({
            "message": "작성자만 수정할 수 있습니다."
        })
    }
}))

//게시글 삭제하기 API (벤 유저 금지) (본인확인)
router.delete("/:idx",loginGuard, banGuard, articleNotfoundMiddleware, wrapper(async (req,res)=>{
    // const userid = req.session.userid;
    const {userId} = req.decoded;

    const articleIdx = req.params.idx; // 404 있어야함 
    const articleDelete = await psql.query("DELETE FROM article.list WHERE idx = $1 AND writer_id = $2",[articleIdx,userId])
    if(articleDelete.rowCount>0){
        res.status(200).send({
            "message":"게시글이 삭제되었습니다."
        })
    }else{
        res.status(401).send({
            "message": "작성자만 삭제할 수 있습니다."
        })
    }
}))

module.exports = router;