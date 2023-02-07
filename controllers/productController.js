const Product = require("../models/productModel");

// to store product
exports.postProduct = async (req, res) => {
  let product = new Product({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    countInStock: req.body.countInStock,
    product_description: req.body.product_description,
    product_image: req.file.path,
    category: req.body.category,
  });

  product = await product.save();

  if (!product) {
    return res.status(400).json({ error: "Something Went wrong" });
  }
  res.send(product);
};

// to show all products
exports.productList = async (req, res) => {
  const product = await Product.find().populate("category" ,"category_name");
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(product);
};

// to get products detail
exports.productDetails = async (req, res) => {
  const product = await product.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(product);
};

exports.updateProducts = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      countInStock: req.body.countInStock,
      product_description: req.body.product_description,
      product_image: req.body.product_image,
      category: req.body.category,
    },
    { new: true }
  );

  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  return res.json(product);
};

exports.deleteProduct = async (req, res) => {
  let product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(403).json({ error: "product not found" });
  }
  res.status(200).json({ message: "product deleted successfully" });
};


// product related to same category
exports.listRelated = async(req,res)=>{
  let single_product = await Product.findById(req.params.id)
  let limit = req.query.limit ? parseInt(req.params.limit) : 6
  let product = await Product.find({_id:{$ne:single_product}, category:single_product.category}).limit(limit).populate("category", "category_name")
  if(!product){
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(product)
}
