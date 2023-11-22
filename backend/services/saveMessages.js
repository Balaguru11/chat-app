// const axios = require("axios");
const Message = require("../model/Message.Model");

exports.saveMessages = async (message, userId, room, sentTime) => {
  try {
    const savedMsg = await Message.create({
      message,
      userId,
      room,
      sentTime,
    });
    return true;
  } catch (err) {
    console.log(err);
  }
};

exports.getMessages = async (room) => {
  const messages = await Message.find({ room: room });
  return messages;
};
