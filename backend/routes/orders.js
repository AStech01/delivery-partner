const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const { auth } = require("../middleware/auth");
const mongoose = require("mongoose");
// GET /orders - Get orders assigned to current partner
router.get("/", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // ✅ convert to ObjectId
    const orders = await Order.find({ assignedTo: userId });
       
    console.log("Current User ID:", userId);
    console.log("Orders Found:", orders);

    res.json(orders);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
