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
const compression = require("compression");
const helmet = require("helmet");
const { addUser, findPassword, findIdByEmail } = require("./db");
const cookieSession = require("cookie-session");
const { hash, comapre } = require("./bcrypt");
const bcrypt = require("./bcrypt");

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
