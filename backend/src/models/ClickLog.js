const mongoose = require("mongoose");

const clickLogSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true
  },
  clickedAt: {
    type: Date,
    default: Date.now
  }
});

const ClickLog = mongoose.model(
  "ClickLog",
  clickLogSchema,
  "CLICK_LOGS"
);

module.exports = ClickLog;