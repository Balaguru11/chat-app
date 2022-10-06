const ChatRoom = require("../model/ChatRoom.Model");
const Message = require("../model/Message.Model");
const { createError } = require("../error");

// need to implement this
// chatroom need to be disabled after some days of creation

exports.creatChatroom = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  try {
    //duplication on title allowed.
    const newChatroom = await ChatRoom.create({
      ...req.body,
      chatRoomType: "public",
      createdBy: user.id,
      usersChatting: [user.id],
    });

    return res.status(200).json({
      message: "A new chatroom has been created  successfully",
      newChatroom,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllChatRooms = async (req, res, next) => {
  try {
    const allLiveChats = await ChatRoom.find({});
    console.log(allLiveChats);
    return res.json(allLiveChats);
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    console.log(req.params.roomid);
    const roomDetails = await ChatRoom.findById(req.params.roomid);
    console.log(roomDetails);
    res.json(roomDetails);
  } catch (err) {
    next(err);
  }
};

exports.getMsgsByRoomId = async (req, res, next) => {
  try {
    console.log(req.params.roomid);
    const roomMsgs = await Message.find({ room: req.params.roomid });
    console.log(roomMsgs);
    res.json(roomMsgs);
  } catch (err) {
    next(err);
  }
};
