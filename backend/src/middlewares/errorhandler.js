const psql = require("../constants/psql")
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")

const notfoundhandler = (req,res,next)=>{
    res.status(404).send({
        "message": "404 API Not Found "
    })
}

const errorhandler = (err, req, res,next)=>{
    console.error(err.message)
    console.error(err.stack)
    res.status(err.statusCode || 500).send({
        "message": err.message
    })
}

const articleNotfoundMiddleware = wrapper(async (req,res,next)=>{
    const targetPage = req.params.idx;
    
    const findPage = await psql.query("SELECT 1 FROM article.list WHERE idx = $1",[targetPage])
    console.log(findPage.rows);
    if(findPage.rows.length === 0){
        throw customError("해당 게시물을 찾을 수 없습니다.",404);
    } 
    next()
})

const commentNotfoundMiddleware = wrapper(async (req,res,next)=>{
    const targetPage = req.params.idx;
    
    const findPage = await psql.query("SELECT 1 FROM comment.list WHERE idx = $1",[targetPage])
    console.log(findPage.rows);
    if(findPage.rows.length === 0){
        throw customError("해당 댓글을 찾을 수 없습니다.",404);
    }
    next()
})

module.exports = {errorhandler, notfoundhandler, articleNotfoundMiddleware, commentNotfoundMiddleware};

