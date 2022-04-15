let config = require('../../config.json');
var mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : 100,
    host     : `${config.mysql.host}`,
    user     : `${config.mysql.user}`,
    password : `${config.mysql.password}`,
    database : `${config.mysql.database}`,
    charset : `${config.mysql.charset}`,
    debug    :  false
});
module.exports = pool;