const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const { auth } = require("../middleware/auth");

// GET /orders - Get orders assigned to current partner
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
