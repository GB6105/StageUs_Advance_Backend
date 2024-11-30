const mysqldb = require("mysql2/promise");

const mysql = mysqldb.createPool({
    host: 'localhost',
    user:'GB',
    password:'6105',
    database:'bulletin_board'

})

module.exports = mysql