var jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

function verifyJWT(req, res, next) {
  console.log(req?.headers)
    const authHeader = req?.headers?.authorization;
    if (!authHeader) {
      return res?.status(401).send({ message: "unauthorized access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res?.status(403).send({ message: "Forbiden access" });
      }
      req.decoded = decoded;
      next();
    });
  }
  
  
  module.exports = verifyJWT;