const mongoose = require("mongoose");
const calendarSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    status: {
      type: String
    },
    notes: {
      type: String,
    },
    availability_date: {
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calendar", calendarSchema);