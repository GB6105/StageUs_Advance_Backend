const pg = require('pg');
require("dotenv").config();

const psql = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password:process.env.DB_PW,
    database: process.env.DB_NAME
})
psql.connect(err =>{
    if(err){
        console.log("faliled to connect db" + drr)
    }else{
        console.log("Successfully connected to psql DB")
        console.log("=========== DB 연결 성공 ==========")
    }
});


module.exports = psql;