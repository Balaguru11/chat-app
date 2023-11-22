const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    //   to: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    room: { type: mongoose.Types.ObjectId, required: true, ref: "ChatRoom" },
    sentTime: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

// chatroom messages will contain, message text, who sent it, to which chatroom, reactions / likes count if any with userids who liked the message
