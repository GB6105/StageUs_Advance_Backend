const errorhandler = (err,req,res,next)=>{
    console.error(err.message)
    console.error(err.stack)
    res.status(err.statusCode || 500).send({
        "message": err.message
    })
}


module.exports = errorhandler;

