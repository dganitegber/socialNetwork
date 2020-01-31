//create new DB
//possible to recycle code from petition
//part one: welcome component, what logged out user see on the site
//big logo or photo that say welcome to the website, and will contain a register component - 4 form fields and submit buttons.
//we need 2 components so we can swap register component with a log in components
//upon registeration make axios post request with the fields. the server will respond with success or failure, if fail - error message.
//regis component should be class for this reason.a class with state.
// after registration/logged in - user can not see welcome component anymore

const express = require("express");
const app = express();
const aws = require("aws-sdk");
const { s3Url } = require("./config");
const s3 = require("./s3");
const compression = require("compression");
const helmet = require("helmet");
const {
    addUser,
    findPassword,
    findIdByEmail,
    storeCode,
    getCode,
    newPassword,
    userDetails,
    logImages
} = require("./db");
const cookieSession = require("cookie-session");
const { hash } = require("./bcrypt");
const bcrypt = require("./bcrypt");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
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
app.use(
    cookieSession({
        secret: "everything is garbage",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
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
            console.log("picture_url", picture_url);
            res.json({
                first: results.rows[0].first,
                last: results.rows[0].last,
                id: results.rows[0].id,
                email: results.rows[0].email,
                picture_url: picture_url
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
    logImages(imageUrl, req.session.userId).then(data => {
        console.log("data return", data);
        res.json(data.rows[0].profpic);
    });

    //unshift() puts an image in the beginning unlike push.
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
