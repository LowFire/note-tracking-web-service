let express = require("express");
let path = require("path");

let app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, 'public')));

const { Pool } = require("pg");
require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

//homepage
app.get("/", function (req, res) {
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

app.listen(5000);