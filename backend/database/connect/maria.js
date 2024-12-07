const maria = require("mysql");

const conn = maria.createConnection({
    host: 'localhost',
    port:3306,
    user:'user',
    password:'pwd',
    database:'db naeme'
})

module.exports = conn;