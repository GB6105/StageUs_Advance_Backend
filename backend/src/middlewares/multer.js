const s3 = require("../constants/S3config")
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'gbsbucket',
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,    
        key(req,file,cb){
            cb(null,`${Date.now()}_${path.basename(file.originalname)}`)
        }
    }),
    limits: {filesize: 5*1024*1024}
})

const upload2 = multer();

module.exports = {upload, upload2}
//final 20250108
