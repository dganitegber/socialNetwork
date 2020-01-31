// DROP TABLE IS EXISTS passcodes
// CREATE TABLE passcode(
//     code VARCHAR NOT NULL UNIQUE CHECK (code !=''),
//     email VARCHAR NOT NULL CHECK (email != '')
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//
// );

const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialmedia"
);

exports.addUser = function(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

exports.findIdByEmail = function(email) {
    return db.query("SELECT id FROM users WHERE email = $1", [email]);
};

exports.findPassword = function(email) {
    return db.query("SELECT password FROM users WHERE email = $1", [email]);
};

exports.storeCode = function(email, code) {
    return db.query(
        "INSERT INTO passcode (email, code) VALUES ($1, $2) RETURNING passcode",
        [email, code]
    );
};

exports.getCode = function(email) {
    return db.query(
        `SELECT * FROM passcode WHERE email=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' ORDER BY created_at DESC LIMIT 1`,
        [email]
    );
};

exports.newPassword = function(email, pass) {
    return db.query("UPDATE users SET password = $2 WHERE email = $1", [
        email,
        pass
    ]);
};

exports.userDetails = function(id) {
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
};

exports.logImages = function(profpic, id) {
    return db.query(
        "UPDATE users SET profpic=$1 WHERE id = $2 RETURNING profpic",
        [profpic, id]
    );
};
