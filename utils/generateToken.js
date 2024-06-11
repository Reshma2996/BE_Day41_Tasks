const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

const generateToken = (email) => {
    return jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
};

module.exports = generateToken;
