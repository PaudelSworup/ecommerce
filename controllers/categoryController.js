const Category = require("../models/categoryModel");

// to post a category in database(db)

exports.postCategory = async (req, res) => {
  let category = new Category(req.body);

  Category.findOne(
    { category_name: category.category_name },
    async (error, data) => {
      if (data == null) {
        category = await category.save();

        if (!category) {
          return res.status(400).json({ error: "something went wrong" });
        }
        res.send({ category });
      } else {
        return res.status(400).json({ error: "Category name must be unique" });
      }
    }
  );
};

// to get category from db

exports.categoryList = async (req, res) => {
  const category = await Category.find();
  if (!category) {
    return res.status(400).json({ error: "something wengt wrong" });
  }
  res.send(category);
};

// to show category details one by one

exports.categoryDetails = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(category);
};

// to update category

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      category_name: req.body.category_name,
    },
    { new: true }
  );
  if (!category) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(category);
};

// to delete category

exports.deleteCategory = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (!category) {
        return res.status(403).json({ error: "category not found" });
      } else return res.status(200).json({ message: "category deleted" });
    })

    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};
