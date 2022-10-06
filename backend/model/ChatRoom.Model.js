const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema(
  {
    chatRoomTitle: { type: String, required: true, maxLength: 30 },
    // chatRoomCategory: { type: String, required: true },
    chatRoomType: {
      type: String,
      enum: ["public", "private"],
      required: true,
      default: "public",
    },
    createdBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    usersChatting: [
      { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);

//users chatting will be extended like, joined time, leftTime,
