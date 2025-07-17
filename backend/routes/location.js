const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const Order = require("../models/Orders");
const { auth } = require("../middleware/auth");

// POST /location - Save delivery location
router.post("/", auth, async (req, res) => {
  const { orderId, lat, lng, item, place, mobile } = req.body;

  if (!lat || !lng || !orderId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const order = await Order.findOne({ id: orderId, assignedTo: req.user.id });
  if (!order) return res.status(403).json({ message: "Not your order" });

  const location = new Location({
    lat, lng, item, place, mobile, orderId,
    username: req.user.username,
    email: req.user.email
  });

  await location.save();
  res.status(201).json({ message: "Location saved" });
});

// GET /location/:orderId - Get last 10 locations
router.get("/:orderId", auth, async (req, res) => {
  const logs = await Location.find({ orderId: req.params.orderId })
    .sort({ timestamp: -1 })
    .limit(10);
  res.json(logs);
});

module.exports = router;
