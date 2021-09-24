const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  const token = auth.split(" ")[1];
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Token in not valid" });
    req.user = user;
    next();
  });
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "secret", {
    expiresIn: "20s",
  });
};

const refreshAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "refreshSecret");
};

module.exports = {
  verify,
  generateAccessToken,
  refreshAccessToken,
};
