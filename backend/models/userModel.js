const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sequelize } = require("../config/db");

// Define User Model
const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100],
    },
  },
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: {
    type: DataTypes.STRING,
    validate: {
      isNumeric: true,
      len: [5, 5],
    },
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  areaOfInterest: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.JSON,
    allowNull: true, // Store Cloudinary URL and public_id
  },
  resetPasswordToken: DataTypes.STRING,
  resetPasswordExpire: DataTypes.DATE,
});

// Hash Password Before Saving
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// JWT Token Method
User.prototype.getJWTToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Reset Token
User.prototype.getResetPwdToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

module.exports = User;
