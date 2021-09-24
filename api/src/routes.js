const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { verify, generateAccessToken, refreshAccessToken } = require("./jwt");
const users = [
  {
    id: "1",
    username: "john",
    password: "johnadmin",
    isAdmin: true,
  },
  {
    id: "2",
    username: "jane",
    password: "janeadmin",
    isAdmin: false,
  },
];
let refreshTokens = [];

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    // generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = refreshAccessToken(user);
    refreshTokens.push(refreshToken);
    return res.json({
      message: `Welcome ${username}`,
      accessToken,
      refreshToken,
    });
  }
  res.json({ message: "Invalid Credentials" });
});

router.post("/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.json({ message: "See you later" });
});

router.post("/refresh", (req, res) => {
  // take the refresh token from user
  const refreshToken = req.body.token;
  // send error if there is no token or it's invalid
  if (!refreshToken) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Refresh token is not valid" });
  }
  jwt.verify(refreshToken, "refreshSecret", (err, user) => {
    err && console.error(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = refreshAccessToken(user);
    refreshTokens.push(newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  // if everything is ok, create a new token for user
});

router.delete("/users/:id", verify, (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    return res.status(204).end();
  }
  res.status(403).json({ message: "You are not allowed to delete this user" });
});

module.exports = router;
