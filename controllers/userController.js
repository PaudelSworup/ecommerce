const User = require("../models/authModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/setEmail");
const validation = require("../utils/validation");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt"); // authorization
const generateToken = require("../utils/generateToken");

// to register user

exports.userRegister = async (req, res) => {
  User.findOne(
    { email: req.body.email, username: req.body.username },
    async (error, data) => {
      if (data) {
        return res.status(409).json({
          success: false,
          error: validation(req.body.email, req.body.username),
        });
      }
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });

      user = await user.save();

      if (!user) {
        return res.status(409).json({
          success: false,
          error: "Something went wrong",
        });
      }
      let token = new Token({
        token: crypto.randomBytes(16).toString("hex"),
        userId: user._id,
      });

      token = await token.save();
      if (!token) {
        return res.status(400).json({
          success: false,
          error: "Something went wrong",
        });
      }
      // send mail
      const url = `${process.env.URL}/confirmation/${token.token}`
      sendEmail({
        from: "no-reply@expresscommerce.com",
        to: user.email,
        subject: "Email verification link",
        // text: `hello, \n\n please verify your account by clicking below link: \n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`, //http://localhost:8000/api/confirmation/3353#6q3,
        html:`<a href = '${url}'>confirm email</a>`
      });
      res.status(200).send(user);
    }
  );
};

// confirming the email
exports.postEmailVefification = (req, res) => {
  // first, find a valid token or matching token
  Token.findOne({ token: req.params.token }, (error, token) => {
    if (error || !token) {
      return res
        .status(400)
        .json({ error: "Invalid token or token may have expired" });
    }
    // if we find valid token then find the valid user for that token
    User.findOne({ _id: token.userId }, (error, user) => {
      if (error || !user) {
        return res
          .status(400)
          .json({ error: "unable to find the valid user for this token" });
      }

      // check if user(email) is already verified
      if (user.isVerified) {
        return res
          .status(400)
          .json({ error: "this email is already verified" });
      }

      // save the verified user
      user.isVerified = true;
      user.save((error) => {
        if (error) {
          return res.status(400).json({ error: error });
        }
        return res
          .status(200)
          .json({ message: "congrats, Your email has been verified" });
      });
    });
  });
};

// resend email verification link
exports.resendVerificationLink = async (req, res) => {
  // at first find the register user
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({
      error:
        "this email is not registered yet, please register your account first",
    });
  }

  // check if user is already verified
  if (user.isVerified) {
    return res.status(400).json({ error: "this email is already verified" });
  }

  // create a token to store in db and send to verification link
  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });

  token = await token.save();
  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Something went wrong",
    });
  }

  // send mail
  
  sendEmail({
    from: "no-reply@expresscommerce.com",
    to: user.email,
    subject: "Email verification link",
    // text: `hello, \n\n please verify your account by clicking below link: \n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`, //http://localhost:8000/api/confirmation/3353#6q3,
   
  });

  res.status(200).json({ message: "verification link has been sent" });
};

// signin process
exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  // first email is registered or not
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error:
        "this email is not registered yet, please register your account first",
    });
  }

  // if email found then check password for that email
  if (!user.authenticate(password)) {
    return res.status(401).json({ error: "Wrong credential" });
  }

  // check if user is verified
  if (!user.isVerified) {
    return res.status(400).json({ error: "verify your email to continue" });
  }

  // now generate token with user id and jwt secret
  const token = generateToken(user._id);
  // store token in the cookie
  res.cookie("mycookie", token, { expire: Date.now() + 99999 });

  // return info to frontend
  const { _id, name, role } = user;
  return res.json({
    token,
    user: {
      _id,
      name,
      role,
    },
  });
};

// forgot password

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error:
        "this email is not registered yet, please register your account first",
    });
  }

  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });

  token = await token.save();
  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Something went wrong",
    });
  }

  // send mail
  const clientUrl = `${process.env.URL}/api/resetpassword/${token.token}`
  sendEmail({
    from: "no-reply@expresscommerce.com",
    to: user.email,
    subject: "Reset your password",
    // text: `hello, \n\n please reset your password by clicking below link: \n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`, //http://localhost:8000/api/resetpass/3353#6q3,
    html:`<a href="${clientUrl}"><button>Reset password</button></a>`
  });

  res.status(200).json({ message: "forgot password link has been sent" });
};

// reset password

exports.resetPassword = async (req, res) => {
  Token.findOne({ token: req.params.token }, async (error, token) => {
    if (error || !token) {
      return res
        .status(401)
        .json({ error: "Invalid token or token may have expired" });
    }

    User.findOne({ _id: token.userId }, async (error, user) => {
      if (error || !user) {
        return res
          .status(400)
          .json({ error: "unable to find the user for valid token" });
      }

      user.hased_password = user.encryptPassword(req.body.password)
      user = await user.save()

      if (!user) {
        return res.status(400).json({ error: "Failed to reset password" });
      }
      return res.status(200).json({ message: "Password has been reset" });
    });
  });
};

// change password
exports.changePassword = async (req, res) => {
  const { password, new_password, repeat_password } = req.body;
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return res.status(400).json({ error: "unable to find the user" });
  }

  if (!user.isVerified) {
    return res.status(400).json({ error: "user is not verified" });
  }
  const verify = await User.findOne({
    hased_password: user.encryptPassword(password),
  });

  if (!verify) {
    return res
      .status(400)
      .json({ error: "your current password didn't match" });
  } else {
    if (new_password === repeat_password) {
        user.hased_password = user.encryptPassword(req.body.new_password)
        user = await user.save()
      if (!user) {
        return res
          .status(400)
          .json({ error: "error in changing password. please try again" });
      }
      return res.status(200).json({ message: "password has been changed" });
    } else {
      return res
        .status(400)
        .json({ error: "your new password and repeat password didn't match" });
    }
  }
};

// signout
exports.signout = (req, res) => {
  res.clearcookie("mycookie");
  res.json({ message: "signout success" });
};

// userlist
exports.userList = async (req, res) => {
  const user = await User.find().select("-hased_password").select("-salt");
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(user);
};

// single
exports.singleUser = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-hased_password")
    .select("-salt");
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(user);
};

// require signin
exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
