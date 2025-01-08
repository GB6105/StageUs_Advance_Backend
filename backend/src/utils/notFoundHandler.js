const notfoundhandler = (req,res,next)=>{
    res.status(404).send({
        "message": "404 API Not Found"
    })
}

module.exports = notfoundhandler;
//final 20250108