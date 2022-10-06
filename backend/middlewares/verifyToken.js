const { createError } = require("../error");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.headers["authorization"];

  console.log("AuthHeader", authHeader);

  if (
    authHeader === undefined ||
    authHeader.split(" ")[0] !== "Bearer" ||
    authHeader.split(" ")[1] !== null
  )
    return next(createError(401, "Invalid Authorization code"));

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return next(createError(403, "Invalid Authorization code"));
    }
    console.log("verifytoken", decoded);
    req.user = decoded;
    next();
  });
};
