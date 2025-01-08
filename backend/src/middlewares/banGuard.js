const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const psql = require("../constants/psql")

const banGuard = wrapper(async (req,res, next)=>{
    // const userid = req.session.userid;
    const {userId} = req.decoded;
    // console.log(userId);
    const banCheck = await psql.query("SELECT * FROM account.list WHERE id = $1 AND isbanned = 'T'",[userId]);
    // console.log(banCheck.rows);
    if(banCheck.rows.length > 0)throw customError("해당 계정은 정지되었습니다.",401)
    next()
})
module.exports = banGuard;
// final 20250108