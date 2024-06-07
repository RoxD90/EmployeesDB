const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "John2meisno",
    database: "workers"
});

connection.connect(function (err){
    if (err) throw err;
});

module.exports = connection;