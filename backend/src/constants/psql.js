const pg = require('pg');
const wrapper = require("../utils/wrapper");

const psql = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: "2323",
    database: "board"
});

const connectToDB = wrapper(async () => {
    const client = await psql.connect(); // Await the connection
    console.log("|========== PostgreSQL DB 연결 성공 =========|");
    client.release(); // Release the client after successful connection
});

connectToDB();
//final 20250108
module.exports = psql;
