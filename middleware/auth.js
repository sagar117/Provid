const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(403).send('Access denied.');

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
}

module.exports = auth;

