let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let passwordHash = require("password-hash");
let session = require('express-session')

let app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret: 'ruthless beef', saveUninitialized: true, resave: false}));

const { Pool } = require("pg");
require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

//homepage
app.get("/", function (req, res) {
    if (req.session.userid)
        res.render("home");
    else
        res.redirect("/loginpage");
});

app.post("/getData", function (req, postRes){
    let userid = req.session.userid;
    pool.query("SELECT note_name, note_date, contents, id FROM notes WHERE user_id = $1", [userid], (err, res) => {
        if (err) {
            throw err;
        }
        postRes.write(JSON.stringify(res.rows));
        postRes.end();
    });
});

app.post("/edit", function (req, res) {
    let userid = req.session.userid;
    let noteid = req.body.noteid;
    let note_name = req.body.note_name;
    let note_date = req.body.note_date;
    let contents = req.body.contents;
    pool.query("UPDATE notes SET note_name = $1, note_date = $2, contents = $3 WHERE user_id = $4 AND id = $5", [note_name, note_date, contents, userid, noteid], (err, resQuery) => {
        if (err) {
            throw err
        }
        res.end();
    });
});

app.post("/add", function (req, res) {
    let userid = req.session.userid;
    let note_name = req.body.note_name;
    let note_date = req.body.note_date;
    let contents = req.body.contents;
    pool.query("INSERT INTO notes (note_name, note_date, contents, user_id) VALUES ($1, $2, $3, $4)", [note_name, note_date, contents, userid], (err, resQuery) => {
        if (err) {
            throw err
        }
        res.end();
    });
});

app.post("/delete", function (req, res) {
    let noteid = req.body.noteid;
    let userid = req.session.userid;

    if (noteid) {
        pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [noteid, userid], (err, resQuery) => {
            if (err) {
                throw err
            }
            res.end();
        });
    } else {
        console.log("Error: Cannot delete note. Note id is undefined.");
    }
});

app.get("/loginpage", function (req, res) {
    res.render("loginpage");
});

app.get("/logout", function (req, res) {
    req.session.userid = 0;
    res.end();
});

//validate username and password
app.post("/login", function (req, res) {
    // code = 0 Success
    // code = 1 Invalid Username
    // code = 2 Invalid password
    let username = req.body.username;
    let password = req.body.password;
    pool.query("SELECT username, hash_password, id FROM users WHERE username = $1", [username], (err, resQuery) => {
        if (err) {
            throw err;
        }

        if (!resQuery.rows) {
            res.write("1");
            console.log("invalid username");
            res.end();
        } else {
            hashedPassword = resQuery.rows[0].hash_password;
            if (passwordHash.verify(password, hashedPassword)) {
                req.session.userid = resQuery.rows[0].id;
                res.write("0");
                res.end();
            } else {
                res.write("1");
                console.log("Invalid password");
                res.end();
            }
        }
    });
});

app.get("/signuppage", function (req, res) {
    res.render("signuppage");
});

app.post("/signupValidate", function (req, res) {
    let username = req.body.username;

    //Check if username is valid
    pool.query("SELECT username FROM users WHERE username = $1", [username], (err, resQuery) => {
        if (err)
            console.log(err.stack);

        if (resQuery.rows[0]) {
            res.write("Username has already been taken. Try a different one.");
        }
        res.end();
    });
});

//Sign up the new user
app.post("/signup", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let hashedPassword;
    if (password) {
        hashedPassword = passwordHash.generate(password);
    } else {
        console.log("Error: Cannot hash password. Password is undefined.");
    }

    if (username && password) {
        console.log("Creating new user");
        pool.query("INSERT INTO users (username, hash_password) VALUES ($1, $2)", [username, hashedPassword], (err, resQuer) => {
            if (err) {
                console.log(err.stack);
            } else {
                console.log("User successfully created");
            }
        });
    } else {
        console.log("Error: Cannot create user. Username or password is undefined.");
    }

    res.redirect("/loginpage");
});

app.listen(process.env.PORT || 5000);