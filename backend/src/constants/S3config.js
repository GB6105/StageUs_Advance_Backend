const {S3Client} = require("@aws-sdk/client-s3");
// import S3Client from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region : 'ap-northeast-2',
    credentials:{
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey:process.env.S3_SECRET_ACCESS_KEY
    }
})


// const {S3Client} = require("@aws-sdk/client-s3");

// const s3 = new S3Client({
//     region : process.env.AWS_REGION,
//     credentials:{
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
//     }
// })

module.exports = s3;
//final 20250108