const router = require("express").Router()
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const validater = require("../middlewares/validater")
const loginGuard = require("../middlewares/loginGuard")
const authGuard = require("../middlewares/authGuard")
const banGuard = require("../middlewares/banGuard")

const regx = require('../constants/regx')
const psql = require("../constants/psql")
const {commentNotfoundMiddleware} = require("../middlewares/errorhandler")


//댓글 좋아요 해제하기
router.delete("/:idx/like",
    loginGuard,
    banGuard,
    commentNotfoundMiddleware,
    wrapper(async (req,res)=>{
    const commentIdx = req.params.idx;
    // const userid = req.session.userid;
    const {userId} = req.decoded;

    const likeDrop = await psql.query("DELETE FROM comment.like WHERE comment_idx = $1 AND account_id = $2",[commentIdx,userId])
    if(likeDrop.rowCount > 0){
        res.status(200).send({
            "message": "해당 댓글을 좋아요 해제하였습니다."
        })
    }else{
        res.status(400).send({
            "message":  "이미 좋아요 해제한 댓글 입니다." 
        })
    }
}) )

//댓글 좋아요 추가하기
router.post("/:idx/like",
    loginGuard,
    banGuard,
    commentNotfoundMiddleware,
    wrapper(async (req,res)=>{
    const commentIdx = req.params.idx;
    // const userid = req.session.userid;
    const {userId} = req.decoded;

    const likeAdd = await psql.query("INSERT INTO comment.like (comment_idx, account_id) VALUES ($1, $2) ON CONFLICT (comment_idx, account_id) DO NOTHING",[commentIdx, userId])
    if(likeAdd.rowCount > 0){
        res.status(200).send({
            "message": "해당 댓글을 좋아요에 추가하였습니다."
        })
    }else{
        res.status(400).send({
            "message":  "이미 좋아요한 게시글 입니다."
        })
    }
}))

//댓글 수정하기
router.patch("/:idx",
    loginGuard,
    banGuard,
    wrapper(async (req,res)=>{
    //const userid = req.session.userid;
    const {userId} = req.decoded;

    const commentIdx = req.params.idx
    const {content} = req.body;
    const commentPatch = await psql.query("UPDATE comment.list SET content = $1 WHERE idx = $2 AND writer_id = $3",[content, commentIdx, userId])
    if(commentPatch.rowCount > 0){
        res.status(200).send({
            "message": "댓글이 수정되었습니다."
        })
    }else{
        res.status(401).send({
            "message": "작성자만 수정할 수 있습니다."
        })
    }
}))


//댓글 삭제하기
router.delete("/:idx",
    loginGuard,
    banGuard,
    wrapper(async (req,res)=>{
    //const userid = req.session.userid;
    const {userId} = req.decoded;

    const commentIdx= req.params.idx;

    const commentDelete = await psql.query("DELETE FROM comment.list WHERE idx = $1 AND writer_id = $2",[commentIdx, userId])
    if(commentDelete.rowCount >0){
        res.status(200).send({
            "message": "댓글이 삭제되었습니다."
        })
    }else{
        res.status(401).send({
            "message": "작성자만 삭제할 수 있습니다."
        })
    }

}))

//게시글에 해당하는 댓글 불러오기
router.get("", 
    loginGuard,
    banGuard,
    wrapper(async (req,res)=>{
    const {articleIdx} = req.body;

    //find article 404
    const findPage = await psql.query("SELECT * FROM article.list WHERE idx = $1",[articleIdx])
    if(findPage.rows.length === 0)throw customError("해당 게시물이 존재하지 않습니다.")

    const commentList = await psql.query("SELECT * FROM comment.list WHERE article_idx = $1",[articleIdx])
    if(commentList.rows.length >0){
        res.status(200).send({
            "comment": commentList.rows
        })
    }else{
        res.status(200).send({          
            "message": "해당 게시글에는 아직 댓글이 없습니다."
        })
    }
}))

//댓글 작성하기
router.post("",
    loginGuard,
    banGuard, 
    validater("content",regx.content),
    wrapper(async (req,res)=>{
    const {articleIdx,content} = req.body;
    const findPage = await psql.query("SELECT * FROM article.list WHERE idx = $1",[articleIdx])
    if(findPage.rows.length === 0)throw customError("해당 게시물이 존재하지 않습니다.")
    //const userid = req.session.userid;
    const {userId} = req.decoded;

    const commentWrite = await psql.query("INSERT INTO comment.list (writer_id, content, article_idx) VALUES ($1, $2, $3)",[userId, content, articleIdx]).catch(err=>{
        res.status(404).send({
            "message": "존재하지 않는 게시글입니다."
        })
        throw err;
    });
    if(commentWrite.rowCount > 0){
        res.status(200).send({
            "message": "댓글 등록되었습니다."
        })
    }
} ))


module.exports = router;