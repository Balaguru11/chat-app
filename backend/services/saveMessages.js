// const axios = require("axios");
const Message = require("../model/Message.Model");

exports.saveMessages = async (message, username, room, sentTime) => {
  const savedMsg = await Message.insertOne({
    message,
    from: username,
    room,
    sentTime,
  });
  console.log("Saved Message", savedMsg);
  return savedMsg;
};

exports.getMessages = async (room) => {
  const messages = await Message.find({ room: room });
  console.log("Get Message", messages);
  return messages;
};
