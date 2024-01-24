const jwt = require('jsonwebtoken');

const jwtConfig = {
    secretKey: process.env.JWT_SECRET,
    expiresIn: '30m',
}

function authToken(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação ausente' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

function generateToken(user) {
    return jwt.sign({ id: user.uuid, username: user.username }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });
}

function readToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error('Token inválido: ' + error.message);
    }
}

module.exports = { authToken, generateToken, readToken };
