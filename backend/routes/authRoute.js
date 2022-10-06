const express = require("express");
const router = express.Router();

const {
  signUpUser,
  userSignIn,
  userSignOut,
} = require("../controllers/authController");

router.post("/signup", signUpUser); // use oAuth for google, facebook and email
router.post("/signin", userSignIn);
router.post("/signout", userSignOut);

module.exports = router;
