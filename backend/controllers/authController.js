const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User.Model");
const { createError } = require("../error");
const { checkDuplicateUser } = require("../services/apiServices");

exports.signUpUser = async (req, res, next) => {
  try {
    // check for duplicate accounts

    checkDuplicateUser(req.body.password)
      .then(() => {
        const hashPwd = bcrypt.hashSync(req.body.password, 10);
        const userData = { ...req.body, password: hashPwd };
        // newUser.save();
        // res.status(200).json({ message: "User signup successful" });
        return userData;
      })
      .then((userData) => createNewuser(userData))
      .then((ress) =>
        res.status(200).json({ message: "User signup successful" })
      )
      .catch((err) => console.log(err));
  } catch (err) {
    next(err);
  }
};

exports.userSignIn = async (req, res, next) => {
  try {
    const isUser = await User.findOne({ email: req.body.email });
    if (!isUser) return next(createError(404, "user not found"));

    const isMatch = bcrypt.compareSync(req.body.password, isUser.password);
    if (!isMatch) return next(createError(400, "Wrong credentials"));
    const token = jwt.sign(
      { id: isUser._id, username: isUser.username },
      process.env.TOKEN_KEY
    );

    const { password, ...others } = isUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ others, token });
  } catch (err) {
    next(err);
  }
};

exports.userSignOut = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
};
