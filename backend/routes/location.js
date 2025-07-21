const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const Order = require("../models/Orders");
const { auth } = require("../middleware/auth");
const mongoose = require("mongoose");

// POST /location - Save delivery location
router.post("/", auth, async (req, res) => {
  const { orderId, mobile, lat, lng, item, place } = req.body;

  // Require lat and lng always
  if (!lat || !lng) {
    return res.status(400).json({ message: "Missing required fields: lat or lng" });
  }

  // Require either orderId or mobile to identify tracking target
  if (!orderId && !mobile) {
    return res.status(400).json({ message: "Missing required fields: orderId or mobile" });
  }

  if (orderId) {
    // Validate order belongs to user
    const order = await Order.findOne({
      id: orderId,
      assignedTo: new mongoose.Types.ObjectId(req.user.id),
    });
    if (!order) {
      return res.status(403).json({ message: "Not your order or order not found" });
    }
  }
  // If tracking by mobile, you might add any validation here if needed

  const location = new Location({
    lat,
    lng,
    item,
    place,
    mobile: mobile || null,
    orderId: orderId || null,
    username: req.user.username,
    email: req.user.email,
  });

  await location.save();
  res.status(201).json({ message: "Location saved" });
});

// GET /location/:orderId - Get last 10 locations for order
router.get("/:orderId", auth, async (req, res) => {
  const logs = await Location.find({ orderId: req.params.orderId })
    .sort({ timestamp: -1 })
    .limit(10);
  res.json(logs);
});

module.exports = router;
