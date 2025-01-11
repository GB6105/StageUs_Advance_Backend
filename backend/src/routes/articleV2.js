//==========================[ Import ]===============================//
const router = require("express").Router();

//constants
const psql = require("../constants/psql");
const regx = require("../constants/regx");
//custom middleware
// fileters
const banGuard = require("../middlewares/banGuard");
const loginGuard = require("../middlewares/loginGuard");
const validater = require("../middlewares/validater");
// error check
const wrapper = require("../utils/wrapper");
const articleFind = require("../utils/articleFind");
// AWS (S3)
const {upload, upload2, upload3} = require("../middlewares/multer");
const s3 = require("../constants/S3config");

//===========================[ Service ]==============================//

//게시글 불러오기 "GET: /article/"
router.get("/:idx",
    loginGuard,
    banGuard,
    wrapper(async (req,res)=>{
    const articleIdx = req.params.idx;
    const articleLoad = await psql.query('SELECT * FROM article.list WHERE idx = $1',[articleIdx]);
    if(articleLoad.rows.length > 0){
        res.status(200).send({
            "data" : articleLoad.rows[0]
        })
    }
}));
//게시글 작성하기 "POST: /article/"

router.post("",
    loginGuard,
    banGuard,
    upload.array('imageList',2),
    wrapper(async(req,res)=>{
        const {title, category, content} = req.body;
        const {userId} = req.decoded;
        let imageList = null;
        let imageUrlList = [];
        imageList = req.files;

        req.files.forEach((file,index) => {
            imageUrlList.push(file.location);
        });

        const articleUpload = await psql.query('INSERT INTO article.list (writer_id, title, category_name, content, image_url) VALUES ($1, $2, $3, $4, $5)',[userId, title, category, content, imageUrlList]);
        if(articleUpload.rowCount > 0){
            res.status(200).send({
                "message": "게시글 작성이 완료되었습니다.",
                "title" : title,
                "category" : category,
                "content" : content,
                "imageUrlList" : imageUrlList
            })
        }
}))

//게시글 수정하기 "PATCH: /article/"



module.exports = router;