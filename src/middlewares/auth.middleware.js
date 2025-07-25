const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

module.exports = {
  auth: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      
      if (!authHeader) {
        return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
      }

      let token;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        token = authHeader;
      }
      if (!token) {
        return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
      }

      const decoded = jwt.verify(token, secretKey);
      req.decoded = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(419).json({ message: '토큰이 만료되었습니다.' });
      } 
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      }
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  },  
    
    }
