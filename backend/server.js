require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors"); 
const app = express();

app.use(cors());
connectDB();
app.use(express.json());


app.use("/auth", require("./routes/auth"));
app.use("/orders", require("./routes/orders"));
app.use("/location", require("./routes/location"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
