// backend/routes/location.js
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  console.log("Received location:", lat, lng);
  // Save to DB, or do something useful

  return res.status(200).json({ message: "Location received" });
});

module.exports = router;
