const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const Product = require("../../models/Product");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("price", "Price is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("image", "Image is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors, req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, price, description, image } = req.body;

      let product = new Product({
        name,
        price,
        description,
        image,
      });

      await product.save();
      return res.status(200).send("Product Created !");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error");
    }
  }
);

router.put("/:id", [], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, price, description, image } = req.body;

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(401).send("Product not found !");
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;

    await product.save();

    return res.status(200).send("Product Updated !");
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(401).send("Product not found !");
    }

    await product.remove();

    return res.status(200).send("Product Deleted !");
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(401).send("Product not found !");
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
