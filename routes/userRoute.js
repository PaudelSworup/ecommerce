const express = require("express");
const {
  userRegister,
  postEmailVefification,
  resendVerificationLink,
  signIn,
  forgotPassword,
  resetPassword,
  signout,
  userList,
  singleUser,
  changePassword,
  requireSignin,
} = require("../controllers/userController");
const { userValidation, validators, resetPasswordValidation } = require("../utils/validator");

const router = express.Router();

router.post("/register", userValidation, validators, userRegister);
router.post("/confirmation/:token", postEmailVefification);
router.post("/resendverification", resendVerificationLink);
router.post("/signin", signIn);
router.post("/signout", signout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPasswordValidation, validators, resetPassword);
router.put("/changepassword/:id", changePassword);

router.get("/userlist", requireSignin, userList);
router.get("/userlist/:id", singleUser);

module.exports = router;
