const wrapper = require("../utils/wrapper")
const { MongoClient } = require("mongodb");
let connection = null;
const mongodb = (async () => {
    if (!connection) {
        const client = new MongoClient("mongodb://localhost:27017", {
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        connection = await client.connect();
        console.log("|============= MongoDB 연결 성공 ============|");
    }
    return connection;
})
// mongodb();

module.exports = mongodb;
