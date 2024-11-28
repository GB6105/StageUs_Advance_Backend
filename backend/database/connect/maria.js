const mariadb = require("mysql");

const maria = mariadb.createConnection({
    host: 'localhost',
    port:3306,
    user:'GB',
    password:'6105',
    database:'bulletin_board'
})

module.exports = maria;