const express = require("express");
const {
  createShortUrl,
  accessShortUrl,
  verifyShortUrlPassword,
  getUrlHistory
} = require("../controllers/urlController");

const router = express.Router();

router.post("/api/urls", createShortUrl);
router.get("/:shortCode", accessShortUrl);
router.post("/:shortCode/verify", verifyShortUrlPassword);
router.get("/api/urls/history", getUrlHistory);
module.exports = router;