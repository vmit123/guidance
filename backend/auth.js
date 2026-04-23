const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config');
const { User } = require('./database');

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const getPasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const createAccessToken = (data, expiresIn = null) => {
  const options = {
    expiresIn: expiresIn || `${config.accessTokenExpireMinutes}m`
  };
  return jwt.sign(data, config.secretKey, options);
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ detail: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, config.secretKey);
    const user = await User.findOne({ where: { username: payload.sub } });
    
    if (!user) {
      return res.status(401).json({ detail: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: "Could not validate credentials" });
  }
};

module.exports = {
  verifyPassword,
  getPasswordHash,
  createAccessToken,
  authenticateToken
};
