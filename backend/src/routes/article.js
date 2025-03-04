//==========================[ Import ]===============================//
const router = require("express").Router()

//constants
const psql = require("../constants/psql");
const regx = require('../constants/regx');

//custom middleware
const articleUpload = require("../utils/articleUpload")
// fileters
const banGuard = require("../middlewares/banGuard");
const loginGuard = require("../middlewares/loginGuard");
const validater = require("../middlewares/validater");
// error check
const wrapper = require("../utils/wrapper");
const articleFind = require("../utils/articleFind");
// AWS (S3)
const {upload, upload2, upload3} = require("../middlewares/multer")
const {S3Client, PutObjectCommand, S3ServiceException} = require("@aws-sdk/client-s3")
const s3 = require("../constants/S3config");

//===========================[ Service ]==============================//


// 게시글 목록 불러오기 API
router.get("",
    loginGuard,
    wrapper(async (req,res)=>{
    const articleList = await psql.query("SELECT title, writer_id FROM article.list")
    if(articleList.rows.length>0){
        res.resValue = articleList;
        console.log(res.resValue);
        res.status(200).send({
            "article_list": articleList.rows
        })
    }else{
        res.status(404).send({
            "message": "아직 게시글이 없습니다."
        })
    }
}))

/**게시글 작성 API 
 * 사진 첨부 불가
 */
router.post("",
    loginGuard,
    banGuard,
    validater([
        {field: "title", regx: regx.title},
        {field: "category", regx: regx.category},
        {field: "content", regx: regx.content},
    ]),
    wrapper(async (req,res)=>{
    const {title, category, content} = req.body;
    // const userid = req.session.userid;
    const {userId} = req.decoded;

    const writeAritcle = await psql.query("INSERT INTO article.list (writer_id, title, category_name,content) VALUES ($1,$2,$3,$4)",[userId,title,category,content])
    if(writeAritcle.rowCount > 0){
        res.status(200).send({
            "message" : "게시글 작성이 완료되었습니다."
        })
    }
}))


/**게시글 작성 API (S3)
 * 사진 첨부 가능
 * S3 저장
 */
router.post("/upload",
    loginGuard,
    // banGuard,
    upload.single('image'),
    validater([
        {field: "title", regx: regx.title},
        {field: "category", regx: regx.category},
        {field: "content", regx: regx.content},
    ]),
    articleUpload    
)

/**게시글 작성 API (EBS)
 * 사진 첨부 가능
 * EBS에 저장장
*/
router.post("/uploadEC2",
    loginGuard,
    upload3.single('image'),
    validater([
        {field: "title", regx: regx.title},
        {field: "category", regx: regx.category},
        {field: "content", regx: regx.content},
    ]),
    articleUpload
)

/**게시글 작성 API
 신버전 sdk(v3)를 이용해서 multer 없이 파일을 업로드하는 방식으로 작성한 라우터
 이 경우 multer를 사용하지 않음 -> multipart/form-data를 사용하지 않음
 -> 이미지를 첨부할 경우 base64로 인코딩된 string을 받아야함
 -> 업로드 단계에서 전처리를 해줘야함
 과 같이 변경된다.
 */
router.post("/uploadv3",
    wrapper(async (req,res)=> {
    const {file, filename, contentType} = req.body;
    const buffer = Buffer.from(file,'base64');

    const command = new PutObjectCommand({
        Bucket : 'gbsbucket',
        Key : filename,//key 속성은 업로드하는 파일이 어떤 이름으로 버킷에 저장되는가에 대한 속성
        Body : buffer,
        ContentType : contentType
    })

    await s3.send(command);

    res.send({
        "message": "200 success",
        "filekey" : filename
    })
}))



// 게시글 좋아요 추가
router.post("/:idx/like",
    loginGuard,
    banGuard, //403
    articleFind, //404
    wrapper(async (req,res)=>{
    const articleIdx = req.params.idx;
    // const userid = req.session.userid;
    const {userId} = req.decoded;
    const likeAdd = await psql.query("INSERT INTO article.like (article_idx,account_id) VALUES ($1, $2) ON CONFLICT (article_idx, account_id) DO NOTHING",[articleIdx,userId])
    if(likeAdd.rowCount > 0){
        res.status(200).send({
            "message": "해당 글을 좋아요에 추가하였습니다."
        })
    }else{
        res.status(409).send({
            "message":  "이미 좋아요한 게시글 입니다."
        })
    }

}))

// 게시글 좋아요 해제
router.delete("/:idx/like",
    loginGuard,
    banGuard,
    articleFind,
    wrapper(async (req,res)=>{
        const articleIdx = req.params.idx;
        // const userid = req.session.userid;
        const {userId} = req.decoded;
        
        const likeDrop = await psql.query("DELETE FROM article.like WHERE article_idx = $1 AND account_id = $2",[articleIdx,userId])
        if(likeDrop.rowCount > 0){
            res.status(200).send({
            "message": "해당 글을 좋아요 해제하였습니다."
        })
    }else{
        res.status(400).send({
            "message":  "이미 좋아요 해제한 게시글 입니다."
        })
    }
}))

// 게시글 불러오기 API (벤 유저 금지)
router.get("/:idx",
    loginGuard,
    banGuard,
    articleFind,
    wrapper(async (req,res)=>{
        const articleIdx = req.params.idx;
    const getArticle = await psql.query("SELECT * FROM article.list WHERE idx = $1",[articleIdx])
    res.status(200).send({
        "article" : getArticle.rows[0]
    })
}))

//게시글 수정하기 API (벤 유저 금지) (본인 확인) (기존 버전)
// router.patch("/:idx",
//     loginGuard,
//     banGuard,
//     validater([
//         {field: "title", regx: regx.title},
//         {field: "category", regx: regx.category},
//         {field: "content", regx: regx.content},
//     ]),
//     articleFind,
//     wrapper(async (req,res)=>{
//     // const userid = req.session.userid
//     const {userId} = req.decoded;
//     const articleIdx = req.params.idx
//     const {title, category, content} = req.body;
    
//     const articlePatch = await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 WHERE idx = $4 AND writer_id = $5",[title, category, content, articleIdx,userId])
//     if(articlePatch.rowCount > 0){
//         res.status(200).send({
//             "message": "게시글이 수정되었습니다."
//         })
//     }else{
//         res.status(401).send({
//             "message": "작성자만 수정할 수 있습니다."
//         })
//     }
// }))


// 게시글 수정 라우터 (이미지 단일, 수정)
router.patch("/:idx",
    loginGuard,
    banGuard,
    upload.single('image'), //s3 멀터 기반으로 받아오는 미들웨어에 유의
    validater([
        {field: "title", regx: regx.title},
        {field: "category", regx: regx.category},
        {field: "content", regx: regx.content},
    ]),
    articleFind,
    wrapper(async (req,res)=>{
    const {userId} = req.decoded;
    const articleIdx = req.params.idx;
    const {title, category, content,image} = req.body;

    let patchResult = null;
    let imageUrl = null;
    if(req.file){
        imageUrl = req.file.location;
        const articlePatch = await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 , image_url = $4 WHERE idx = $5 AND writer_id = $6",[title, category, content, imageUrl, articleIdx,userId])
        patchResult = articlePatch;
    }else{
        if(image == null){
           const articlePatch = await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 , image_url = null WHERE idx = $4 AND writer_id = $5",[title, category, content, articleIdx,userId])
           patchResult = articlePatch
        }else{
           const articlePatch = await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 WHERE idx = $4 AND writer_id = $5",[title, category, content, articleIdx,userId])
           patchResult = articlePatch
        }
    }
    
    const result = await psql.query('SELECT * FROM article.list WHERE idx = $1',[articleIdx])
    res.status(200).send({
        "message": "게시글이 수정되었습니다.",
        "data" : result.rows
    })

}))

//게시글 삭제하기 API (벤 유저 금지) (본인확인)
router.delete("/:idx",
    loginGuard,
    banGuard,
    articleFind, 
    wrapper(async (req,res)=>{
    // const userid = req.session.userid;
    const {userId} = req.decoded;

    const articleIdx = req.params.idx; // 404 있어야함 
    const articleDelete = await psql.query("DELETE FROM article.list WHERE idx = $1 AND writer_id = $2",[articleIdx,userId])
    if(articleDelete.rowCount>0){
        res.status(200).send({
            "message":"게시글이 삭제되었습니다."
        })
    }else{
        res.status(401).send({
            "message": "작성자만 삭제할 수 있습니다."
        })
    }
}))

module.exports = router;
//final 20250114
