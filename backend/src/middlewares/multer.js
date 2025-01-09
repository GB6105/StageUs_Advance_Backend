const s3 = require("../constants/S3config")
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require("fs");

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'gbsbucket',
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,    
        key(req,file,cb){
            cb(null,`image/${Date.now()}_${path.basename(file.originalname)}`)
        }
    }),
    limits: {filesize: 5*1024*1024}
})

const upload2 = multer(); // none 용도 

const upload3 = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, path.join(__dirname, "../../public")); 
        },
        filename(req, file, done) {
            done(null, `${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { filesize: 5 * 1024 * 1024 }
});

module.exports = {upload, upload2, upload3}
//final 20250108
