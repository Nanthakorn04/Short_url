const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
require("dotenv").config();

const app = express();
let mongoConnectionPromise = null;

app.use(cors());
app.use(express.json());

async function connectToMongoDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoose.connection.readyState === 2 && mongoConnectionPromise) {
    await mongoConnectionPromise;
    return;
  }

  mongoConnectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await mongoConnectionPromise;
    console.log("Connected to MongoDB");
  } catch (error) {
    mongoConnectionPromise = null;
    throw error;
  }
}

app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    return res.status(503).json({
      message: "Unable to connect to MongoDB",
    });
  }
});

app.use(urlRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Short URL API is running" });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
