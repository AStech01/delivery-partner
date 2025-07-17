const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  item: String,
  customer: String,
  address: String,
  fromLocation: String,
  toLocation: String,
  status: { type: String, enum: ["pending", "delivered", "cancelled"], default: "pending" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Orders", orderSchema);
