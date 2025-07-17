const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  item: String,
  place: String,
  username: String,
  email: String,
  mobile: String,
  orderId: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Location", locationSchema);
