const express = require('express');
const md5 = require('md5');
const auth_Mid = require('../middleware/auth_Mid');

const router = express.Router();

router.get('/login', (req, res) => {
    const token = req.cookies.authToken;
    if (token) {
        res.redirect('/tasks');
        return;
    }
    res.render('login', { error: null });
});

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    if (!username || !password) {
        return res.render('login', { error: 'נא למלא את כל השדות' });
    }

    let cleanUsername = global.addSlashes(username);
    let hashedPassword = md5(password);
    
    let query = "SELECT * FROM users WHERE username = '" + cleanUsername + "' AND password = '" + hashedPassword + "'";
    global.db_pool.execute(query, (err, results) => {
        if (err || results.length === 0) {
            return res.render('login', { error: 'שם משתמש או סיסמה שגויים' });
        }

        let user = results[0];
        let token = auth_Mid.generateToken(user);
        res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.redirect('/tasks');
    });
});

router.get('/register', (req, res) => {
    const token = req.cookies.authToken;
    if (token) {
        res.redirect('/tasks');
        return;
    }
    res.render('register', { error: null });
});

router.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    
    if (!username || !password || !confirmPassword) {
        return res.render('register', { error: 'נא למלא את כל השדות' });
    }
    
    if (password !== confirmPassword) {
        return res.render('register', { error: 'הסיסמאות אינן תואמות' });
    }
    
    if (password.length < 6) {
        return res.render('register', { error: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
    }

    let cleanUsername = global.addSlashes(username);
    let hashedPassword = md5(password);
    
    let query = "INSERT INTO users (username, password) VALUES ('" + cleanUsername + "', '" + hashedPassword + "')";
    global.db_pool.execute(query, (err, results) => {
        if (err) {
            return res.render('register', { error: 'שם המשתמש כבר קיים' });
        }
        
        let user = { id: results.insertId, username: username };
        let token = auth_Mid.generateToken(user);
        res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.redirect('/tasks');
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login');
});

module.exports = router; 