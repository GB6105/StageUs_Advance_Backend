const client = require("mongodb").MongoClient
const wrapper = require("../utils/wrapper")


const mongodb = wrapper(async ()=>{
    const connect = await client.connect("mongodb://localhost:27017")
    console.log("|============= MongdDB 연결 성공 ============|")
})
mongodb();
module.exports = mongodb;