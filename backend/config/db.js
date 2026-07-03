const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "agripulse",
    connectTimeout: 10000
});

db.connect((err) => {
    if (err) {
        console.error("Connection Failed:");
        console.error(err);
        return;
    }
    console.log("✅ MySQL Connected Successfully");
});

module.exports = db;