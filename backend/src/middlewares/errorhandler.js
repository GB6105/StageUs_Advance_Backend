const notfoundhandler = (req,res,next)=>{
    res.status(404).send({
        "message": "404 Not Found"
    })
}

const errorhandler = (err,req,res,next)=>{
    console.error(err.message)
    console.error(err.stack)
    res.status(500).send({
        "message": err.message
    })
}

module.exports = {errorhandler, notfoundhandler};

