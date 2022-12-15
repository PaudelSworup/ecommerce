const express = require("express");
const {
  postCategory,
  categoryList,
  categoryDetails,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { requireSignin } = require("../controllers/userController");
const { categoryValidation, validators } = require("../utils/validator");

const router = express.Router();

router.post("/postcategory", requireSignin, categoryValidation, validators, postCategory);
router.get("/categorylist", categoryList);
router.get("/categorydetails/:id", categoryDetails);
router.put(
  "/updatecategory/:id",
  categoryValidation,
  validators,
  updateCategory
);
router.delete("/deletecategory/:id", deleteCategory);

module.exports = router;
