//create new DB
//possible to recycle code from petition
//part one: welcome component, what logged out user see on the site
//big logo or photo that say welcome to the website, and will contain a register component - 4 form fields and submit buttons.
//we need 2 components so we can swap register component with a log in components
//upon registeration make axios post request with the fields. the server will respond with success or failure, if fail - error message.
//regis component should be class for this reason.a class with state.
// after registration/logged in - user can not see welcome component anymore
//needs to be changes when uploading to heroku
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

const cryptoRandomString = require("crypto-random-string");
const cookieSession = require("cookie-session");
const compression = require("compression");
const { s3Url } = require("./config");
const { hash } = require("./bcrypt");
const uidSafe = require("uid-safe");
const bcrypt = require("./bcrypt");
const helmet = require("helmet");
const multer = require("multer");
const aws = require("aws-sdk");
const s3 = require("./s3");

const {
    getFriendsWannabesAllInOne,
    extractLastMessages,
    acceptFriendRequest,
    insertMessageToDB,
    getUsersByTyping,
    deleteFriendship,
    findIdByEmail,
    getFriendship,
    getLastUsers,
    findPassword,
    userDetails,
    newPassword,
    storeCode,
    logImages,
    addFriend,
    addUser,
    getCode,
    logBio
} = require("./db");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}
const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "us-east-1"
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// const csurf = require("csurf");
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(helmet());
app.use(express.static("./public"));
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());

// app.use(csurf());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log("*************** /register POST ***********");
    console.log("req.body", req.body);
    hash(req.body.password)
        .then(password => {
            addUser(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                password
            )
                .then(data => {
                    // console.log('result which includes the RETURNING data: ', result);
                    // GET ACTUAL ID HERE:
                    // let res = res.rows[0];
                    console.log("61", data.rows[0].id);
                    // console.log();

                    req.session.userId = data.rows[0].id;
                    res.json({
                        success: true
                    });
                })
                .catch(err => {
                    console.log("err in /register POST: ", err);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(err => {
            console.log("err in /register POST: ", err);
            res.json({
                success: false
            });
        });
});

app.get("/logout", (req, res) => {
    console.log("*************** /logout ***********");
    req.session = null;
    res.redirect("/welcome");
});

app.post("/login", (req, res) => {
    console.log("*************************POST LOGIN*************************");
    var body = req.body;
    console.log("116", body);
    if (body.email.length !== 0 && body.password.length !== 0) {
        findPassword(body.email, body.password)
            .then(results => {
                bcrypt
                    .compare(body.password, results.rows[0].password)
                    .then(val => {
                        if (val === true) {
                            findIdByEmail(body.email)
                                .then(find => {
                                    req.session.userId = find.rows[0].id;
                                    console.log(req.session.userId, "95");
                                    res.json({
                                        success: true
                                    });
                                })
                                .catch(err => {
                                    console.log("im here", err);
                                    res.render("login", {
                                        err
                                    });
                                });
                        } else {
                            res.json({
                                success: false
                            });
                        }
                    });
            })
            .catch(err => {
                console.log("im here", err);
                res.render("login", {
                    err
                });
            });
    } else {
        const oops = "Please fill the correct forms";
        res.render("login", {
            err: "Error",
            oops
        });
    }
});

app.post("/forgotpass", (req, res) => {
    console.log(
        "*************************POST forgotpass*************************"
    );
    var body = req.body;
    console.log("149", body);
    findIdByEmail(body.email).then(results => {
        console.log(" 151 results.rows", results.rows.length);
        if (results.rows.length === 0) {
            console.log("Email isnt in the system!");
            res.json({
                success: false
            });
        } else {
            const secretCode = cryptoRandomString({
                length: 6
            });
            console.log("secretCode", secretCode);

            storeCode(body.email, secretCode).then(data => {
                console.log("data,160", data);
                ses.sendEmail({
                    Source: "Coding camp <dganite@gmail.com>",
                    Destination: {
                        ToAddresses: ["dganite+ses@gmail.com"]
                    },
                    Message: {
                        Body: {
                            Text: {
                                Data:
                                    "please reset your Email. your code is " +
                                    secretCode +
                                    ". Please click go to http://localhost:8080/newpass to activate your code."
                            }
                        },
                        Subject: {
                            Data: "Your Application Has Been Accepted!"
                        }
                    }
                })
                    .promise()
                    .then(
                        () => console.log("194 it worked!"),
                        res.json({
                            success: true
                        })
                    )
                    .catch(err => console.log(err));
            });
        }
    });
});

app.post("/newpass", (req, res) => {
    console.log(
        "*************************POST newpass*************************"
    );
    var body = req.body;
    var session = req.session;
    console.log("body", body);
    console.log("session", session);
    getCode(body.email).then(results => {
        if (
            results.rows[0].code === body.passcode &&
            body.newPass === body.newPassRepeat
        ) {
            hash(body.newPass).then(password => {
                newPassword(body.email, password)
                    .then(
                        res.json({
                            success: true
                        })
                    )
                    .catch(err => console.log(err));
            });
        } else if (
            results.rows[0].code === body.passcode ||
            body.newPass != body.newPassRepeat
        ) {
            res => {
                res.json({
                    success: false
                });
            };
        }
    });
});
app.get("/user", (req, res) => {
    console.log("************get USER*****************");
    // var body = req.body;
    var session = req.session;
    console.log("session", session);
    userDetails(req.session.userId)
        .then(results => {
            console.log(results.rows);
            console.log(results.rows[0].profpic);
            if (results.rows[0].profpic === null) {
                var picture_url;
                picture_url = "/profile.png";
            } else {
                picture_url = results.rows[0].profpic;
            }
            if (results.rows[0].bio === null) {
                var bio;
                bio = "";
            } else {
                bio = results.rows[0].bio;
            }
            // console.log("bio", bio);

            res.json({
                first: results.rows[0].first,
                last: results.rows[0].last,
                id: results.rows[0].id,
                email: results.rows[0].email,
                picture_url: picture_url,
                bio: bio
            });
        })

        .catch(err => console.log(err));
});
app.get("/otheruser/:id", (req, res) => {
    console.log("************get OTHER USER*****************");
    // var body = req.body;
    console.log("req.params.id", req.params.id, "req.session", req.session);
    userDetails(req.params.id)
        .then(results => {
            console.log("req.session", req.session);
            // console.log("bio", bio);
            if (results.rows[0].profpic === null) {
                var picture_url;
                picture_url = "/profile.png";
            } else {
                picture_url = results.rows[0].profpic;
            }
            if (results.rows[0].bio === null) {
                var bio;
                bio = "";
            } else {
                bio = results.rows[0].bio;
            }

            res.json({
                first: results.rows[0].first,
                last: results.rows[0].last,
                id: results.rows[0].id,
                email: results.rows[0].email,
                profpic: picture_url,
                bio: bio,
                loggedUser: req.session.userId
            });
        })

        .catch(err => console.log(err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log(
        "*************************POST upload*************************"
    );
    const file = req.file;
    // const body = req.body;
    let imageUrl = s3Url + file.filename;
    console.log(file);
    // console.log("body.id", session.id, body.file.filename);
    //the url for the image is https://s3.amazonaws.com/:yourBucketName/:filename.
    console.log("imageurl", imageUrl);

    //after query is successful, send a response
    console.log("id", req.session.userId);
    logImages(imageUrl, req.session.userId)
        .then(data => {
            console.log("data return", data);
            res.json(data.rows[0].profpic);
        })
        .catch(err => console.log(err));

    //unshift() puts an image in the beginning unlike push.
});

app.post("/bio", (req, res) => {
    console.log("*************************POST bio*************************");
    var body = req.body;
    var session = req.session;
    console.log(body, session);
    logBio(body.bio, session.userId)
        .then(data => {
            res.json(data.rows[0].bio);
        })
        .catch(err => console.log(err));
});
app.get("/api/user/:id", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    }
});

app.get("/getLastUsers.json", (req, res) => {
    console.log("*****************GET LAST USERS*******************");
    // console.log(req);
    getLastUsers()
        .then(data => {
            // console.log(data);
            res.json(data.rows);
        })
        .catch(err => console.log(err));
});

app.get("/getinput/:user.json", (req, res) => {
    console.log("*****************GET input*******************");
    getUsersByTyping(req.params.user)
        .then(data => {
            console.log("Data from getUsersbytyping", data);
            res.json(data);
        })
        .catch(err => console.log(err));
});

app.get("/friendsStatus/:id", (req, res) => {
    console.log("******get button*****");
    console.log("req.session", req.session, "req.params.id", req.params.id);
    getFriendship(req.session.userId, req.params.id).then(data => {
        console.log("return data from getFriendship", data);
        res.json(data);
    });
});

app.post("/addfriend/:id", (req, res) => {
    console.log("******add friend*****");
    console.log(
        "req.session this user",
        req.session,
        "req.params.id otheruser",
        req.params.id
    );
    addFriend(req.session.userId, req.params.id).then(data => {
        console.log("Data from getUsersbytyping", data);
        res.json(data);
    });
});

app.post("/removefriend/:id", (req, res) => {
    console.log("******remove friend*****");
    deleteFriendship(req.session.userId, req.params.id).then(data => {
        console.log("Data from getUsersbytyping", data);
        res.json(data);
    });
});

app.post("/acceptfriends/:id", (req, res) => {
    console.log("******accept friends*****");
    console.log(
        "req.session",
        req.session.userId,
        "req.params.id",
        req.params.id
    );
    acceptFriendRequest(req.session.userId, req.params.id).then(data => {
        console.log("data. from acceptfriends", data);
        res.json(data);
    });
});

app.get("/friendswannabes", (req, res) => {
    console.log(
        "************************ GET friends-wannabes***************************************"
    );
    console.log("req.session.userId", req.session.userId);
    getFriendsWannabesAllInOne(req.session.userId)
        // console
        //     .log(req.session.userId)
        .then(data => {
            console.log("Data from getfreidnwannabes", data);
            res.json(data.rows);
        })
        .catch(err => console.log(err));
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});

io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    extractLastMessages().then(data => {
        console.log("data.rows", data.rows);
        io.sockets.emit("chatMessages", data.rows.reverse());
        // res.json(data);
    });
    // const userId = socket.request.session.userId;
    socket.on("my amazing message", msg => {
        console.log("on the server...", msg, socket.request.session.userId);
        insertMessageToDB(socket.request.session.userId, msg)
            .then(() => {
                extractLastMessages().then(data => {
                    console.log("data.rows changed", data.rows);
                    io.sockets.emit("chatMessage", data.rows.reverse());
                    // res.json(data);
                });
            })

            .catch(err => console.log(err));
        //no emit msg to everyone
        io.sockets.emit("muffin", msg);
    });

    /* go and get  the last 10  chat messages from DB (we need a new DB table and query.
        dg.getLastTenChatMessages().then(data =>{ io.sockets.emit('chatMessages', data.rows)

    }).catch err => console.log(err);


     */
});

// io.on("connection", socket => {
//     console.log(`connection! ${socket.id}`);
//     socket.on("disconnect", () => {
//         console.log(`disconnection ${socket.id}`);
//     });
//     socket.emit("hello", {
//         message: "nice to see you"
//     });
// });
