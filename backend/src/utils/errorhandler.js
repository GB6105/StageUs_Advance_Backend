const errorhandler = (err,req,res,next)=>{
    if(process.env.MODE == "dev"){
        console.error(err.message)
        console.error(err.stack)
    }
    res.resValue = err.stack;
    res.status(err.statusCode || 500).send({
        "message": err.message
    })
}

module.exports = errorhandler;
//final 20250108