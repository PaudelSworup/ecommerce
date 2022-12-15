const express = require("express");
const {
  postProduct,
  productList,
  productDetails,
  updateProducts,
  deleteProduct,
  listRelated,
} = require("../controllers/productController");
const router = express.Router();
const upload = require("../middleware/file-upload");
const { productValidation, validators } = require("../utils/validator");

router.post(
  "/postproduct",
  upload.single("product_image"),
  productValidation,
  validators,
  postProduct
);
router.get("/productlist", productList);
router.get("/productdetails/:id", productDetails);
router.put("/updateproduct/:id", updateProducts);
router.delete("/deleteproduct/:id", deleteProduct);
router.get("/listrelated/:id", listRelated)

module.exports = router;
