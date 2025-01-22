require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      res.status(401).json({
        status: 401,
        result: false,
        message: "Not Authorized",
      });
    } else {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(401).json({
            status: 401,
            result: false,
            message: "Token is not valid"
          });
        } else {
          req.uid = decoded.id;
          req.role = decoded.role;
          req.name = decoded.name;
          next();
        }
      });
    }
  } catch (error) {
    res.status(401).send(error.toString());
  }
};

module.exports = checkAuth;