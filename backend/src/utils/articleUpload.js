const wrapper = require("../utils/wrapper");
const psql = require("../constants/psql")

const articleUpload = wrapper(async(req,res)=>{
    const {title, category, content} = req.body;
    const {userId} = req.decoded;
    const imageUrl = req.file || "";
    
    await psql.query("INSERT INTO article.list (writer_id, title, category_name,content,image_url) VALUES ($1,$2,$3,$4,$5)",[userId,title,category,content,imageUrl])
    console.log(req.file);
    console.log(req.body);
    
    res.status(200).send({
        "message" : "게시글 작성이 완료되었습니다.",
        "url": imageUrl,
        "title" : title,    
        "category" : category,
        "content": content
    })
})

module.exports = articleUpload;
//final 20250114