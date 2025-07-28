var jwt = require('jsonwebtoken');
const SECRET_KEY = 'homework-secret-key-2024';

async function isLogged(req, res, next) {
    const jwtToken = req.cookies.authToken;
    let user_id = -1;
    if (jwtToken !== "") {
        jwt.verify(jwtToken, SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                console.log("err=", err);
            } else {
                req.user = decodedToken;
                user_id = decodedToken.userId;
            }
        });
    }
    if(user_id < 0)
        res.redirect("/login");
    next();
}

function generateToken(user) {
    return jwt.sign({
        userId: user.id,
        username: user.username
    }, SECRET_KEY, { expiresIn: '24h' });
}

module.exports = {
    isLogged,
    generateToken,
    SECRET_KEY
}; 