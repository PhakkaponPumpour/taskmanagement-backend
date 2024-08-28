const jwt = require("jsonwebtoken");
////Uses jwt.verify() to verify the token. 
//The verify method takes three arguments:
//The token to be verified
//The secret key ("pp") used for signing the token

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Authentication token required" });
  } // if there's no token, return 401

  jwt.verify(token, "pp", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    } // if the token is invalid, return 403

    req.user = user;
    next(); // pass the execution off to the next middleware
  });
};

module.exports = { authenticateToken };
