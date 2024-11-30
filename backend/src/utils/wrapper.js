// const wrapper = (func) => {
//     return (req,res,next,...elem)=>{
//         try{
//             func(req,res,next,...elem)
//         }catch(err){
//             if(process.env.MODE === "dev"){
//                 console.log(err.message)
//                 console.log(err.stack)
//             }
//             res.status(err.statusCode || 500).send({
//                 "message":err.message
//             })
//         }
//     }
// }

const wrapper = async (func) => {
    return (req,res,next,...elem)=>{
        try{
            func(req,res,next,...elem)
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