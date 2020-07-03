let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let passwordHash = require("password-hash");

let app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const { Pool } = require("pg");
require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

//variable storing user id. If 0, client is not signed in.
let userid = 0;

//homepage
app.get("/", function (req, res) {
    if (userid === 0)
        res.redirect("/loginpage");
    else
        res.render("home");
});

app.post("/getData", function (req, postRes){
    pool.query("SELECT note_name, note_date, contents FROM notes WHERE user_id = $1", [1], (err, res) => {
        if (err) {
            throw err;
        }
        postRes.write(JSON.stringify(res.rows));
        postRes.end();
    });
});

app.get("/loginpage", function (req, res) {
    res.render("loginpage");
});

//validate username and password
app.post("/login", function (req, res) {

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