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
const tasks_R = require('./Routers/tasksRouter');
const categories_R = require('./Routers/categoriesRouter');

app.use('/', auth_R);
app.use('/', tasks_R);
app.use('/', categories_R);

// Apply authentication middleware to protected routes
app.get('/tasks', auth_Mid.isLogged);
app.get('/tasks/new', auth_Mid.isLogged);
app.post('/tasks', auth_Mid.isLogged);
app.post('/tasks/toggle/:id', auth_Mid.isLogged);
app.get('/categories', auth_Mid.isLogged);
app.post('/categories', auth_Mid.isLogged);
app.get('/categories/delete/:id', auth_Mid.isLogged);

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