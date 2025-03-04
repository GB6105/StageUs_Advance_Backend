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


//게시글 불러오기 
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

//게시글 수정하기 

router.put("/:idx",
    upload.array('imageList'),
    wrapper(async(req,res)=>{
    const {title, category, content, image} = req.body;
    // const {userId} = req.decoded;
    const userId = "test2";//토큰 없애고 임시 지정
    const articleIdx = req.params.idx;

    let updatedImageList = []; // 사진 추가시 갱신되는 이미지 리스트트
    let patchResult = null; // 쿼리 값을 받아올 변수

    imageRequest =JSON.parse(image); // 이미지 리스트트이 JSON이므로 파싱->객체로 변경경
    console.log(imageRequest);

    const loadOriginalArticle = await psql.query("SELECT * FROM article.list WHERE idx = $1",[articleIdx]); //원 게시글 불러오기
    if (loadOriginalArticle.rows.length === 0) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }
    const oldImageList = loadOriginalArticle.rows[0].image_url;
    
    // 사진이 추가
    if(req.files){ 
        const size = Object.keys(imageRequest).length;
        console.log(size);
        req.files.forEach((file,index) => {
            imageRequest[index +1 + size] = (file.location);
        });
        
        updatedImageList = imageRequest;
        console.log(updatedImageList)
        patchResult= await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 , image_url = $4 WHERE idx = $5 AND writer_id = $6",[title, category, content, updatedImageList, articleIdx,userId])
    }
    else{// 사진 추가 없음
        if(imageRequest !== oldImageList){// 사진 순서변경,삭제등 바뀌면 바뀐 리스트로 덮어쓰기
            updatedImageList = imageRequest;
            patchResult = await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 , image_url = $4 WHERE idx = $5 AND writer_id = $6",[title, category, content, updatedImageList, articleIdx,userId])
             
        }else{ // 사진 관련 아무것도 하지 않으면
            patchResult = await psql.query("UPDATE article.list SET title = $1, category_name = $2, content = $3 WHERE idx = $4 AND writer_id = $5",[title, category, content, articleIdx,userId])
        }
    }
    
    if(patchResult.rowCount > 0){
        const result = await psql.query('SELECT * FROM article.list WHERE idx = $1',[articleIdx])
        res.status(200).send({
            "message": "게시글이 수정되었습니다.",
            "data" : result.rows
        })
    }else{
        res.status(401).send({
            "message": "작성자만 수정할 수 있습니다."
        })
    }
    
}))

//게시글 작성하기 
router.post("",
    // loginGuard,
    // banGuard,
    upload.array('imageList',5),
    wrapper(async(req,res)=>{
        const {title, category, content} = req.body;
        // const {userId} = req.decoded;
        const userId = "test2";
        let imageList = null;
        // let imageUrlList = [];
        let imageUrlList = {};
        imageList = req.files;

        req.files.forEach((file,index) => {
            // imageUrlList.push(file.location);
            imageUrlList[index+1] = (file.location);
        });
        console.log(imageUrlList)
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

module.exports = router;
//final 20250114
