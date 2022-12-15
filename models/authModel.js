const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: Number,
      default: 0,
    },

    hased_password: {
      type: String,
      required: true,
    },

    salt: String,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// virtual fields
authSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hased_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//   defining methods

authSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  authenticate: function (plaintext) {
    return this.encryptPassword(plaintext) === this.hased_password;
  },
};
module.exports = mongoose.model("User", authSchema);
