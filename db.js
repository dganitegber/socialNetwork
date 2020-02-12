// DROP TABLE IS EXISTS passcodes
// CREATE TABLE passcode(
//     code VARCHAR NOT NULL UNIQUE CHECK (code !=''),
//     email VARCHAR NOT NULL CHECK (email != ''),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//
// );
//

//
// CREATE TABLE friends(
//   id SERIAL PRIMARY KEY,
//   asked_by INT REFERENCES users(id) NOT NULL,
//   asked_to INT REFERENCES users(id) NOT NULL,
//   accepted BOOLEAN DEFAULT false
// );
// CREATE TABLE users(
//   id SERIAL PRIMARY KEY UNIQUE,
//   first VARCHAR NOT NULL,
//   last VARCHAR NOT NULL,
//   email VARCHAR NOT NULL,
//   password VARCHAR NOT NULL,
//   profpic VARCHAR,
//   bio VARCHAR
// );
// CREATE TABLE chat(
//   id SERIAL PRIMARY KEY,
//   sent_by INT REFERENCES users(id),
//   msg VARCHAR NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
//
// // // );
// )

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

exports.getLastUsers = function() {
    return db.query("SELECT * FROM users ORDER BY id desc limit 3");
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

exports.logBio = function(bio, id) {
    return db.query("UPDATE users SET bio=$1 WHERE id = $2 RETURNING bio", [
        bio,
        id
    ]);
};

exports.getUsersByTyping = function(val) {
    return db
        .query(
            `SELECT first, last, id, profpic, bio FROM users WHERE first ILIKE $1 ORDER BY ID DESC;`,
            [val + "%"]
        )
        .then(({ rows }) => {
            return rows;
        });
};
exports.getFriendship = function(userId, otherId) {
    return db.query(
        `SELECT * FROM friends WHERE (asked_to = $1 AND asked_by = $2) OR (asked_to = $2 AND asked_by = $1)`,
        [userId, otherId]
    );
};

exports.addFriend = function(userId, otherId) {
    return db.query(
        "INSERT INTO friends (asked_by, asked_to) VALUES ($1, $2) RETURNING asked_by",
        [userId, otherId]
    );
};

exports.acceptFriendRequest = function(recipient_id, sender_id) {
    return db.query(
        `UPDATE friends SET accepted = true WHERE (asked_to = $1 AND asked_by = $2) RETURNING accepted`,
        [recipient_id, sender_id]
    );
};

exports.deleteFriendship = function(sender_id, recipient_id) {
    return db.query(
        `DELETE FROM friends WHERE (asked_to = $1 AND asked_by = $2) OR (asked_to = $2 AND asked_by = $1)`,
        [sender_id, recipient_id]
    );
};

exports.getFriendsWannabesAllInOne = function(asked_to) {
    return db.query(
        `SELECT users.id, users.first, users.last, users.profpic, friends.accepted
            FROM users
            JOIN friends
            ON (accepted = false AND asked_to = $1 AND asked_by = users.id)
            OR (accepted = false AND asked_by = $1 AND asked_to = users.id)

            OR (accepted = true AND asked_to = $1 AND asked_by = users.id)
            OR (accepted = true AND asked_by = $1 AND asked_to = users.id)`,
        [asked_to]
    );
};

exports.insertMessageToDB = function(userId, msg) {
    return db.query(
        "INSERT INTO chat (sent_by, msg) VALUES ($1, $2) RETURNING msg",
        [userId, msg]
    );
};

exports.extractLastMessages = function() {
    return db.query(
        "SELECT users.profpic, users.first, users.last, chat.msg, chat.sent_by, chat.id, chat.created_at FROM users JOIN chat ON chat.sent_by=users.id ORDER BY chat.id DESC LIMIT 10"
    );
};
