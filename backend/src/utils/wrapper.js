const wrapper = (func) => {
    return async (req,res,next,...elem)=>{
        try{
            await func(req,res,next,...elem)
        }catch(err){
            if(process.env.MODE === "dev"){
                console.log(err.message)
                console.log(err.stack)
            }
            res.status(err.statusCode || 500).send({
                "message":err.message
            })
        }
    }
}

module.exports = wrapper