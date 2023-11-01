const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recepientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message:{
    type: String
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
