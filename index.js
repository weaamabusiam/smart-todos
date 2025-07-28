const port = 3000;
const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.urlencoded({extended: false}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
global.jwt = require('jsonwebtoken');

let db_M = require('./database');
global.db_pool = db_M.pool;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "./views"));
app.use(express.static('public'));

global.addSlashes = require('slashes').addSlashes;
global.stripSlashes = require('slashes').stripSlashes;
global.md5 = require('md5');

const auth_Mid = require("./middleware/auth_Mid");
const auth_R = require('./Routers/authRouter');

app.use('/', auth_R);

app.get('/', (req, res) => {
    const token = req.cookies.authToken;
    if (token) {
        res.redirect('/tasks');
    } else {
        res.redirect('/login');
    }
});

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
}); 