const express = require("express");
const router = express.Router();

const {
  creatChatroom,
  getAllChatRooms,
  getRoomById,
  getMsgsByRoomId,
} = require("../../controllers/chatController");

// create chatroom
router.route("/").get(getAllChatRooms).post(creatChatroom);
router.get("/:roomid", getRoomById);
router.get("/message/:roomid", getMsgsByRoomId);

module.exports = router;
