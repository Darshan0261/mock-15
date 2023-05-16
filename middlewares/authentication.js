const jwt = require('jsonwebtoken');

const { JWTKEY } = require('../configs/config');

const authentication = (req, res, next) => {
    const token  = req.headers.authorization || req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: 'Login to Continue' });
    }
    jwt.verify(token, JWTKEY, (err, decoded) => {
        if (err) {
            return res.status(501).send({ message: err.message });
        }
        req.body.userInfo = decoded;
        next()
    })
}

module.exports = {
    authentication
}