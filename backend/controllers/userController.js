const ChatRoom = require("../model/ChatRoom.Model");
const { createError } = require("../error");

// exports.userSignout = async (req, res, next) => {
//   try {
//     // get the user from jwt
//     const user = req.user;
//     const token = req.headers.accessToken;
//     if (!token) return next(createError(401, "No access token provided"));
//   } catch (err) {
//     next(err);
//   }
// };
