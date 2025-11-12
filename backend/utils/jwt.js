const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'devsecret';
const exp = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: exp });
  }
  function verifyToken(token) {
    return jwt.verify(token, secret);
    }
    module.exports = { signToken, verifyToken };