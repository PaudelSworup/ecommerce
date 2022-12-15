const { check, validationResult } = require("express-validator");
const User = require("../models/authModel")

exports.categoryValidation = [
  check("category_name", "Category name must be mandatory")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("category name must be at least three characters"),
];

exports.productValidation = [
  check("product_name", "product name must be mandatory")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("product name must be at least three characters"),
  check("product_price", "product price is required")
    .notEmpty()
    .isNumeric()
    .withMessage("price must be in numeric value"),
  check("countInStock", "stock quantity is required")
    .notEmpty()
    .isNumeric()
    .withMessage("stock quantity must be in numeric value"),
  check("product_description", "product description is required")
    .notEmpty()
    .isLength({ min: 30 })
    .withMessage(" product description  must be at least 30 character "),
  check("category", "category is required").notEmpty(),
];

exports.userValidation = [
  check("name", " name must be mandatory")
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage(" name must be at least two characters"),
  check("email", "email is required")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format").custom(val=>{
      return User.findOne({email:val}).then(user=>{
        if(user){
          return Promise.reject("Email already exist")
        }
      })
    }),
  check("username", "username is required")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("username must be at least five characters").custom(val=>{
      return User.findOne({username:val}).then(user=>{
        if(user){
          return Promise.reject("username already exist")
        }
      })
    }),
  check("password", "password is required")
    .notEmpty()
    .matches(/[a-z]/)
    .withMessage("password must contain one lowercase alphabet")
    .matches(/[A-Z]/)
    .withMessage("password must contain one uppercase alphabet")
    .matches(/[0-9]/)
    .withMessage("password must contain one numeric value")
    .matches(/[@$#-_/*&]/)
    .withMessage("password must contain one special character")
    .isLength({ min: 8 })
    .withMessage("password must be atleast 8 character")
    .isLength({ max: 50 })
    .withMessage("password can't be more than 50 character"),
  // check("category", "category is required").notEmpty(),
];


exports.resetPasswordValidation = [
  check("password", "password is required")
    .notEmpty()
    .matches(/[a-z]/)
    .withMessage("password must contain one lowercase alphabet")
    .matches(/[A-Z]/)
    .withMessage("password must contain one uppercase alphabet")
    .matches(/[0-9]/)
    .withMessage("password must contain one numeric value")
    .matches(/[@$#-_/*&]/)
    .withMessage("password must contain one special character")
    .isLength({ min: 8 })
    .withMessage("password must be atleast 8 character")
    .isLength({ max: 50 })
    .withMessage("password can't be more than 50 character"),
]

exports.orderValidation = [
  check("orderItems" , "orderItems are required").notEmpty(),
  check("shippingAddress1", "you must enter your address").notEmpty().isLength({min:3}).withMessage("address name must be at least 3 character"),
  check("city","Please enter your city").notEmpty().isLength({min:3}).withMessage("city name must be at least 3 character"),
  check("country", "please enter your country name").notEmpty(),
  check("zip","please enter your zip").matches(/[0-9]/).withMessage("zip can contain only numbers"),
  check("phone", "please enter your valid phone number").matches(/[0-9]/).withMessage("phone number can contain only numbers"),
]

exports.validators = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    return res.status(400).json({ error: error.array()[0].msg });
  }
};
