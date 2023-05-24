const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Discount = require("../../models/Discount");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("percentage", "Percentage is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("addedBy", "Added By is required").not().isEmpty(),
    check("startsFrom", "Starts From is required").not().isEmpty(),
    check("endsAt", "Ends At is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, description, addedBy, percentage, startsFrom, endsAt } =
        req.body;

      let discount = new Discount({
        name,
        description,
        addedBy,
        percentage,
        startsFrom,
        endsAt,
      });

      discount.save();
      return res.status(200).send("Discount Created !");
    } catch (error) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

router.put("/:id", [], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, description, percentage, startsFrom, endsAt } = req.body;

    const { id } = req.params;
    const discount = await Discount.findById(id);

    if (!discount) {
      return res.status(401).send("Discount not found !");
    }

    discount.name = name || discount.name;
    discount.description = description || discount.description;
    discount.percentage = percentage || discount.percentage;
    discount.startsFrom = startsFrom || discount.startsFrom;
    discount.endsAt = endsAt || discount.endsAt;

    discount.save();
    return res.status(200).send(discount);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const discounts = await Discount.find();
    return res.status(200).send(discounts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.find({ _id: id });

    if (!discount) {
      return res.status(401).send("Discount not found !");
    }

    return res.status(200).send(discount);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

router.delete("/:id", [], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;

    const discount = await Discount.findById(id);

    if (!discount) {
      return res.status(401).send("Discount not found !");
    }

    await discount.remove();
    return res.status(200).send("Discount deleted !");
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
