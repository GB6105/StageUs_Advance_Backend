const wrapper = (func) => {
    return async (req,res,next,...elem)=>{
        try{
            // eventEmitter.emit("log","라우터 실행 전",req,res)
            // console.log(req,res,"실행 전")
            await func(req,res,next,...elem)
            // eventEmitter.emit("log","라우터 실행 후",req,res)
            // console.log(res,"실행 후")
        }catch(err){
            next(err);
        }
    }
}

module.exports = wrapper
//final 20250108