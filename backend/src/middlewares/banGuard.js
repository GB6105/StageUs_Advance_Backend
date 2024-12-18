const customError = require("../utils/customError")
const wrapper = require("../utils/wrapper")
const psql = require("../constants/psql")

const banGuard = wrapper(async (req,res, next)=>{
    const userid = req.session.userid;
    const banCheck = await psql.query("SELECT * FROM account.isBanned WHERE account_id = $1 AND ban = 'T'",[userid]);
    // console.log(banCheck);
    if(banCheck.rows.length > 0)throw customError("해당 계정은 정지되었습니다.",401)
    next()
})
module.exports = banGuard;