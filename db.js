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
