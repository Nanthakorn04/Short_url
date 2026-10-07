const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(urlRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Short URL API is running" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();