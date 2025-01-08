const {S3Client} = require("@aws-sdk/client-s3");
// import S3Client from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region : 'ap-northeast-2',
    credentials:{
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey:process.env.S3_SECRET_ACCESS_KEY
    }
})

module.exports = s3;
//final 20250108