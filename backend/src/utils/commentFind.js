const psql = require("../constants/psql")
const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")

const commentNotfoundMiddleware = wrapper(async (req,res,next)=>{
    const targetPage = req.params.idx;
    
    const findPage = await psql.query("SELECT 1 FROM comment.list WHERE idx = $1",[targetPage])
    console.log(findPage.rows);
    if(findPage.rows.length === 0){
        throw customError("해당 댓글을 찾을 수 없습니다.",404);
    }
    next()
})


module.exports = commentNotfoundMiddleware;
//final 20250108
