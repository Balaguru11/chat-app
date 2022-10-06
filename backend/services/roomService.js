const ChatRoom = require("../model/ChatRoom.Model");

exports.leaveRoom = async (userId, roomUsers) => {
  return roomUsers.filter((user) => user.id != userId);
};
