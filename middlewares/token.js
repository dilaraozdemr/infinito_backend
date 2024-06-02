const jwt = require('jsonwebtoken');
const secret = 'secret';

const verifyUser = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token gönderimi sağlanmadı' });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token hatalı' });
    }

    req.adminId = decoded.id;
    next();
  });
};
module.exports = verifyUser;