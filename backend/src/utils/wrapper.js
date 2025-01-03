const wrapper = (func) => {
    return async (req,res,next,...elem)=>{
        try{
            // eventEmitter.emit("log","라우터 실행 전",req,res)
            // console.log(req,res,"실행 전")
            await func(req,res,next,...elem)
            // eventEmitter.emit("log","라우터 실행 후",req,res)
            // console.log(res,"실행 후")
        }catch(err){
            // if(process.env.MODE === "dev"){
            //     // eventEmitter.emit("error",req,res,err)
            //     console.log(err.message)
            //     console.log(err.stack)
            // }
            // res.status(err.statusCode || 500).send({
            //     "message":err.message
            // })
            next(err);
        }
    }
}

module.exports = wrapper