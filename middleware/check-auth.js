const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // split(" ") is done to remove bearer from token
    const token = req.headers.authorization.split(" ")[1];

    // console.log(token);
    const verify = jwt.verify(token, "mynameisanirudh");
    // if verified then next() will execute otherwise catch
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "invalid token",
    });
  }
};
